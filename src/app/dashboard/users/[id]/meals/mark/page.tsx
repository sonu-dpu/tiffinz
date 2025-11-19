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
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { DailyMealFor, MealType } from "@/constants/enum";
import { getAllMeals, GetAllMealsOptions } from "@/helpers/client/meal";
import { useAppSelector } from "@/hooks/reduxHooks";
import { IMeal } from "@/models/meal.model";
import { IUser } from "@/models/user.model";
import {
  mealLogSchemaForAdminClient,
  mealLogSchemaForAdminClientType,
} from "@/zod/mealLog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useForm } from "react-hook-form";

function RecordMealPage() {
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  if (!selectedUser) {
    return <div>No user selected</div>;
  }
  return (
    <Card>
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
  type: MealType.regular,
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
  const handleFormSubmit = (formData: mealLogSchemaForAdminClientType) => {
    setValue("user", String(user?._id));
    console.log("data", formData);
  };
  if (isFetching) {
    <div>Loading..</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const meals = data?.meals ?? [];
  console.log("errors", errors);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-2">
      {/* {String(user._id)} */}
      <Input
        label="User"
        defaultValue={String(user._id)}
        readOnly
        {...register("user")}
        errorMessage={errors.user?.message}
      />
      <div>
        <label htmlFor="meal">Meal</label>
        <NativeSelect id="meal" className="max-w-fit" {...register("meal")}>
          <NativeSelectOption className="w-full" value="">Select Meal</NativeSelectOption>
          {meals.map((meal: IMeal) => (
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
      <Button>Submit</Button>
    </form>
  );
};
export default RecordMealPage;
