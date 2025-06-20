import { ApiResponse } from "@/utils/ApiResponse";
import {
  deleteMealById,
  updateMeal,
  getMealById,
} from "@/helpers/server/meals";
import { ApiError } from "@/utils/apiError";
import { withAuth } from "@/utils/withAuth";
import { updateMealSchema } from "@/zod/meals.schema";
import { UserRole } from "@/constants/enum";

type MealParams = { mealId: string };
export const GET = withAuth<MealParams>(
  async (_req, params, user) => {
    const { mealId } = (await params) as MealParams;
    if (!mealId) {
      throw new ApiError("Meal id not found", 400);
    }
    console.log('user', user)
    const meal = await getMealById(mealId);
    return ApiResponse.success("Meal fetched Successfully", { meal });
  },
  // { requiredRole: UserRole.user }
);



// admin routes
export const PATCH = withAuth<MealParams>(
  async (req, params) => {
    const body = await req.json();
    const { mealId } = (await params) as MealParams;
    console.log("mealId", mealId);
    if (!mealId) {
      throw new ApiError("Meal id not found", 400);
    }
    const parseResult = updateMealSchema.safeParse(body);
    if (!parseResult.success) {
      return ApiResponse.zodError(parseResult.error);
    }
    const mealData = parseResult.data;
    const updatedMeal = await updateMeal(mealId, mealData);
    return ApiResponse.success("Meal updated successfully", { updatedMeal });
  },
  { requiredRole: UserRole.admin }
);

export const DELETE = withAuth<MealParams>(
  async (_req, params) => {
    const { mealId } = (await params) as MealParams;
    if (!mealId) {
      throw new ApiError("Meal id not found", 400);
    }
    await deleteMealById(mealId);
    return ApiResponse.success("Meal deleted");
  },
  { requiredRole: UserRole.admin }
);
