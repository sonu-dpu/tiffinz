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

