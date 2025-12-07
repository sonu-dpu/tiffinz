import { ApiResponse } from "@/utils/ApiResponse";
import {
  getMealById,
} from "@/helpers/server/meals";
import { ApiError } from "@/utils/apiError";
import { withAuth } from "@/utils/withAuth";


type MealParams = { mealId: string };
export const GET = withAuth<MealParams>(
  async (_req, context, user) => {
    const { mealId } = await context.params
    if (!mealId) {
      throw new ApiError("Meal id not found", 400);
    }
    console.log('user', user)
    const meal = await getMealById(mealId);
    return ApiResponse.success("Meal fetched Successfully", { meal });
  },
  // { requiredRole: UserRole.user }
);




