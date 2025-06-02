import { ApiResponse } from "@/lib/ApiResponse";
import connectDB from "@/lib/dbConnect";
import Meal from "@/models/meal.model";
import {
  deleteMealById,
  deleteMealByIds,
} from "@/services/server/meals/delete.meal";
import { getAllMeals } from "@/services/server/meals/get.meals";
import { asyncHandler } from "@/utils/asyncHandler";
import { MealInput, mealSchema } from "@/zod/meals.schema";

export const GET = asyncHandler(async()=>{  
  const meals = await getAllMeals();
  return ApiResponse.success("Meals fetched successfully", {meals})
})


export const POST = asyncHandler(async (req) => {
  const body = await req.json();
  const parseResult = mealSchema.safeParse(body);
  if (!parseResult.success) {
    return ApiResponse.zodError(parseResult.error);
  }
  const mealData: MealInput = parseResult.data;
  await connectDB();
  const meal = await Meal.create(mealData);
  if (!meal) {
    return ApiResponse.error("Failed to create meal", 500);
  }
  return ApiResponse.success("Meal added successfully", meal);
});

export const DELETE = asyncHandler(async (req) => {
  const mealId = req.nextUrl.searchParams?.get("id");
  console.log("mealId", mealId);

  // Handle single deletion
  if (mealId) {
    const isDeleteSuccess = await deleteMealById(mealId);
    if (!isDeleteSuccess) {
      return ApiResponse.error("Failed to delete meal ", 500);
    }
    return ApiResponse.success("Meal deleted successfully");
  }

  const body = await req.json();
  const mealIds = body?.meals;
  await deleteMealByIds(mealIds);

  return ApiResponse.success("Meals deleted successfully", 200);
});

