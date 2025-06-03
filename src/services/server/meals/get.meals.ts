
import connectDB from "@/utils/dbConnect";
import Meal from "@/models/meal.model";
import { ApiError } from "@/utils/apiError";
import { isValidObjectId } from "mongoose";

export async function getAllMeals() {
  await connectDB();
  const meals = await Meal.find();
  return meals;
}

export  async function getMealById(id:string) {
    await connectDB();
    if(!isValidObjectId(id)){
        throw new ApiError("Invalid mealId", 400);
    }
    const meal = await Meal.findById(id);
    console.log(meal)
    return meal;
}
