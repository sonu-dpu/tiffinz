"use client";
import Loader from "@/components/ui/Loader";
import { getAllMeals } from "@/helpers/client/meal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MealCard from "./MealCard";
import { IMeal } from "@/models/meal.model";
import { MealType } from "@/constants/enum";

function MealsContainer() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllMeals"],
    queryFn: () => getAllMeals({ isActive: true, type: MealType.regular }),
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  const meals = data?.meals;
  if (meals.length > 0) {
    return (
      <div className="container mx-auto my-4 p-2">
        <h1 className="font-bold my-4">Meals </h1>
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-2 justify-center ">
          {meals.map((meal: IMeal) => (
            <MealCard listOnly key={String(meal._id)} meal={meal} />
          ))}
        </div>
      </div>
    );
  }

  return <div>No Meals</div>
}

export default MealsContainer;
