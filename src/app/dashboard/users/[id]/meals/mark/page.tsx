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
  mealLogSchemaForAdminClient,
  mealLogSchemaForAdminClientType,
} from "@/zod/mealLog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
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
  }, [userId, dispatch]);

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
  const [open, setOpen] = useState(true);
  const [mealExtras, setMealExtras] = useState<MealExtrasTypes[]>([]);
  const handleFormSubmit = async (
    formData: mealLogSchemaForAdminClientType
  ) => {
    setValue("user", String(user?._id));
    console.log("data", formData);
    markMealTakenByUser(formData)
      .then((res) => {
        console.log("meal marked", res);
        router.push(`/dashboard/users/${user._id}/meals`);
        toast.success("Meal marked successfully");
      })
      .catch((err) => {
        toast.error("Error marking meal: " + err.message);
        console.error("error marking meal", err.message);
      });
  };
  if (isFetching) {
    <div>Loading..</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  const meals = data?.meals ?? [];
  const baseMeals = useMemo(() => {
    return meals.filter((meal: IMeal) => meal.type !== MealType.extras);
  }, [meals]);
  const extras = useMemo(() => {
    return meals.filter((meal: IMeal) => meal.type === MealType.extras);
  }, [meals]);
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
        <NativeSelect id="meal" className="max-w-fit" {...register("meal")}>
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
        <NativeSelect id="mealFor" {...register("mealFor")}>
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
      <DialogWrapper
        trigger={true}
        title="Add Extras"
        open={open}
        onOpenChange={setOpen}
      >
        <AddMealExtrasForm extrasItems={extras} />
      </DialogWrapper>
      <Button type="submit">Submit</Button>
    </form>
  );
};

const AddMealExtrasForm = ({ extrasItems }: { extrasItems: IMeal[] }) => {
  return (
    <div className="space-y-4 p-4 rounded-md ">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Select Extra Meal</label>

        <NativeSelect className="w-full">
          <NativeSelectOption value="">Choose a meal...</NativeSelectOption>

          {extrasItems.map((meal: IMeal) => (
            <NativeSelectOption key={String(meal._id)} value={String(meal._id)}>
              {meal.name} — {formatToIndianCurrency(meal.price)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="number"
          label="quantity"
          defaultValue={1}
          min={1}
          className="w-24"
        />
      </div>
      <Button type="button" variant="default">
        Add Extra
      </Button>
    </div>
  );
};

export default RecordMealPage;
