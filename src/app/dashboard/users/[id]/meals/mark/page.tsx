"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  // CardAction,
  CardFooter,
} from "@/components/ui/card";
import DialogWrapper from "@/components/ui/dialog-wrapper";
import { Input } from "@/components/ui/input";
import LoaderButton from "@/components/ui/loader-button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { DailyMealFor, MealType } from "@/constants/enum";
import { markMealTakenByUser } from "@/helpers/client/admin.meals";
import { getUserById } from "@/helpers/client/admin.users";
import { getAllMeals, GetAllMealsOptions } from "@/helpers/client/meal";
import { useAppSelector } from "@/hooks/reduxHooks";
import { formatToIndianCurrency } from "@/lib/utils";
import { IMeal } from "@/models/meal.model";
import { IUser } from "@/models/user.model";
import { setSelectedUser } from "@/store/usersSlice";
import {
  extrasItemSchema,
  ExtrasItemSchemaType,
  mealLogSchemaForAdminClient,
  mealLogSchemaForAdminClientType,
} from "@/zod/mealLog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function RecordMealPage() {
  const { id: userId } = useParams();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && String(selectedUser?._id) !== String(userId)) {
      getUserById(String(userId)).then((user) => {
        dispatch(setSelectedUser(user));
      });
    }
  }, [userId, dispatch, selectedUser]);

  if (!selectedUser) {
    return <div>Loading user...</div>;
  }
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Record Meal</CardTitle>
        <CardDescription>for {selectedUser.fullName}</CardDescription>
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent>
        <RecordMealForm user={selectedUser} />
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

const options: GetAllMealsOptions = {
  isActive: true,
  // type: MealType.regular,
};

type MealExtrasTypes = {
  mealId: string;
  quantity: number;
};
const RecordMealForm: FC<{ user: IUser }> = ({ user }) => {
  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllMeals", options],
    queryFn: () => getAllMeals(options),
    refetchOnWindowFocus: false,
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(mealLogSchemaForAdminClient) });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mealExtras, setMealExtras] = useState<MealExtrasTypes[]>([]);
  const [isLoading, startTransition] = useTransition();
  const handleFormSubmit = async (
    formData: mealLogSchemaForAdminClientType
  ) => {
    setValue("user", String(user?._id));
    console.log("data", formData);
    // transform local MealExtrasTypes (mealId, quantity) to the shape expected by the API ({ extras, quantity })
    const extrasPayload = mealExtras.map((e) => ({
      extras: e.mealId,
      quantity: e.quantity,
    }));
    startTransition(async () => {
      try {
        const response = await markMealTakenByUser({
          ...formData,
          extras: extrasPayload,
        });
        toast.success("Meal recorded successfully");
        router.push(
          `/dashboard/transactions/${response.transactionId}?mealLogId=${response.mealLog._id}`
        );
        console.log("response", response);
      } catch (err) {
        console.error("Error while marking meal ", err);
        toast.error("Failed to record meal");
      }
    });
  };

  const meals = useMemo(() => data?.meals ?? [], [data?.meals]);
  const baseMeals = useMemo(() => {
    return meals.filter((meal: IMeal) => meal.type !== MealType.extras);
  }, [meals]);
  const extras = useMemo(() => {
    return meals.filter((meal: IMeal) => meal.type === MealType.extras);
  }, [meals]);
  if (isFetching) {
    <div>Loading..</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  console.log("errors", errors);
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 gap-2"
    >
      {/* {String(user._id)} */}
      <Input
        label="User"
        defaultValue={String(user._id)}
        readOnly
        {...register("user")}
        errorMessage={errors.user?.message}
      />
      <div>
        <label htmlFor="meal">Base Meal</label>
        <NativeSelect id="meal" className="w-full" {...register("meal")}>
          <NativeSelectOption className="w-full" value="">
            Select Base Meal
          </NativeSelectOption>
          {baseMeals.map((meal: IMeal) => (
            <NativeSelectOption key={String(meal._id)} value={String(meal._id)}>
              {meal.name} — {meal.type.toLowerCase()}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {errors.meal && <p className="text-red-400">{errors.meal.message}</p>}
      </div>

      <div>
        <label htmlFor="mealFor">Meal</label>
        <NativeSelect className="w-full" id="mealFor" {...register("mealFor")}>
          <NativeSelectOption value="" disabled>
            Meal For
          </NativeSelectOption>
          {Object.values(DailyMealFor).map((item) => (
            <NativeSelectOption key={item} value={item}>
              {item.toLowerCase()}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      {/* extras items will be displayed here */}
      <div>
        {mealExtras.length > 0 && (
          <div className="space-y-1">
            <label className="font-medium">Extras Added:</label>
            <ul className="list-disc list-inside">
              {mealExtras.map((extra, index) => {
                const mealDetails = extras.find(
                  (meal: IMeal) => String(meal._id) === extra.mealId
                );
                return (
                  <li className="flex items-center justify-between" key={index}>
                    {mealDetails ? mealDetails.name : "Unknown Meal"} -
                    Quantity: {extra.quantity}{" "}
                    <Button
                      variant="ghost"
                      size="sm"
                      className=""
                      onClick={() => {
                        // remove this extra from mealExtras
                        setMealExtras((prev) =>
                          prev.filter((meal) => meal.mealId !== extra.mealId)
                        );
                      }}
                    >
                      <MinusCircle />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size={"sm"}
          onClick={() => setOpen(true)}
        >
          <PlusCircle /> Extras
        </Button>
        <DialogWrapper title="Add Extras" open={open} onOpenChange={setOpen}>
          <AddMealExtrasForm
            extrasItemsWithDetails={extras}
            setMealExtras={setMealExtras}
            mealsExtras={mealExtras}
            setOpen={setOpen}
          />
        </DialogWrapper>
      </div>

      <LoaderButton
        fallbackText="Record..."
        isLoading={isLoading}
        type="submit"
      >
        Record
      </LoaderButton>
    </form>
  );
};

const AddMealExtrasForm = ({
  extrasItemsWithDetails,
  setMealExtras,
  mealsExtras,
  setOpen,
}: {
  extrasItemsWithDetails: IMeal[];
  setMealExtras: React.Dispatch<React.SetStateAction<MealExtrasTypes[]>>;
  mealsExtras: MealExtrasTypes[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(extrasItemSchema) });
  const handleAddExtra = (data: ExtrasItemSchemaType) => {
    const isAvailable = extrasItemsWithDetails.some(
      (meal: IMeal) => String(meal._id) === data.extras
    );
    if (!isAvailable) {
      setError("extras", {
        type: "manual",
        message: "Selected meal is not available",
      });
      return;
    }
    // check if already added then just update quantity
    const alreadyAddedIndex = mealsExtras.findIndex(
      (extra) => String(extra.mealId) === data.extras
    );
    if (alreadyAddedIndex !== -1) {
      const updatedExtras = [...mealsExtras];
      updatedExtras[alreadyAddedIndex].quantity += data.quantity;
      setMealExtras(updatedExtras);
      setOpen(false);
      return;
    }
    setMealExtras((prev) => [
      ...prev,
      { mealId: data.extras, quantity: data.quantity },
    ]);
    setOpen(false);
  };
  return (
    <div className="space-y-4 p-4 rounded-md ">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Select Extra Meal</label>

        <NativeSelect {...register("extras")} className="w-full">
          <NativeSelectOption value="">Choose a meal...</NativeSelectOption>
          {extrasItemsWithDetails.map((meal: IMeal) => (
            <NativeSelectOption key={String(meal._id)} value={String(meal._id)}>
              {meal.name} — {formatToIndianCurrency(meal.price)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {errors.extras && (
          <p className="text-red-400">{errors.extras.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          {...register("quantity", { valueAsNumber: true })}
          type="number"
          label="quantity"
          defaultValue={1}
          min={1}
          className="w-24"
          errorMessage={errors.quantity?.message}
        />
      </div>
      <Button
        type="button"
        variant="default"
        onClick={handleSubmit(handleAddExtra)}
      >
        Add Extra
      </Button>
    </div>
  );
};

export default RecordMealPage;
