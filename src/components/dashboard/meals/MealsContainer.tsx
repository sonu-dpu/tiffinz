"use client"
import Loader from "@/components/ui/Loader";
import { getAllMeals } from "@/helpers/client/meal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MealCard from "./MealCard";
import { IMeal } from "@/models/meal.model";

function MealsContainer() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllMeals"],
    queryFn: () => getAllMeals({ isActive: true }),
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
  return (
    <div className="container mx-auto my-4 p-2">
      <h1 className="font-bold my-4">Meals </h1>
      <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-2 justify-center ">
        {meals.map((meal: IMeal) => (
          <MealCard key={String(meal._id)} meal={meal} />
        ))}
      </div>
    </div>
  );
}

export default MealsContainer;
