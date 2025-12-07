import { updateMealSchema } from "@/zod/meals.schema";
import { UserRole } from "@/constants/enum";
import { ApiResponse } from "@/utils/ApiResponse";
import {
  deleteMealById,
  updateMeal,
} from "@/helpers/server/meals";
import { ApiError } from "@/utils/apiError";
import { withAuth } from "@/utils/withAuth";
type MealParams = { mealId: string };


export const PATCH = withAuth<MealParams>(
  async (req, context) => {
    const body = await req.json();
    const { mealId } = await context.params
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

// delete meal by id
export const DELETE = withAuth<MealParams>(
  async (_req, context) => {
    const { mealId } = await context.params
    if (!mealId) {
      throw new ApiError("Meal id not found", 400);
    }
    await deleteMealById(mealId);
    return ApiResponse.success("Meal deleted");
  },
  { requiredRole: UserRole.admin }
);