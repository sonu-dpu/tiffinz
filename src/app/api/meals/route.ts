import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import Meal from "@/models/meal.model";
import {
  deleteMealById,
  deleteMealByIds,
  getAllMeals,
} from "@/helpers/server/meals";
import { withAuth } from "@/utils/withAuth";
import { MealInput, mealSchema } from "@/zod/meals.schema";
import { UserRole } from "@/constants/enum";

export const GET = withAuth(
  async () => {
    const meals = await getAllMeals();
    return ApiResponse.success("Meals fetched successfully", { meals });
  },
  { requiredRole: UserRole.user }
);

export const POST = withAuth(
  async (req) => {
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
  },
  { requiredRole: UserRole.admin }
);

export const DELETE = withAuth(
  async (req) => {
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
  },
  { requiredRole: UserRole.admin }
);
