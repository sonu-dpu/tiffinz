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
} from "@/components/ui/native-select"
import { MealType } from "@/constants/enum";
import { getAllMeals, GetAllMealsOptions } from "@/helpers/client/meal";
import { useAppSelector } from "@/hooks/reduxHooks";
import { IMeal } from "@/models/meal.model";
import { IUser } from "@/models/user.model";
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
  type:MealType.regular
};
const RecordMealForm: FC<{ user: IUser }> = ({ user }) => {

  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllMeals", options],
    queryFn: () => getAllMeals(options),
    refetchOnWindowFocus:false
  });
  const {register, handleSubmit} = useForm()
  const handleFormSubmit = (data)=>{
    console.log('data', data)
  }
  if (isFetching) {
    <div>Loading..</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const meals = data?.meals ?? [];
  console.log("data", data);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {String(user._id)}
      <Input defaultValue={user.fullName} readOnly {...register("user")} />
      <br />
      <NativeSelect
      className="w-full"
      {...register("meal")}
    >
      <NativeSelectOption value="">Select Meal</NativeSelectOption>
      {meals.map((meal: IMeal) => (
        <NativeSelectOption key={String(meal._id)} value={String(meal._id)}>
          {meal.name} — {meal.type.toLowerCase()}
        </NativeSelectOption>
      ))}
    </NativeSelect>
    <Button>Submit</Button>
    </form>
  );
};
export default RecordMealPage;
