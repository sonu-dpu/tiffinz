import { UserRole } from "@/constants/enum";
import { markMealTakenAndUpdateAccountBalance } from "@/helpers/server/admin.meal-logs";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { mealLogSchemaInput } from "@/zod/mealLog.schema";

type MealOrderParamsByAdmin = { mealId: string; userId: string };
export const POST = withAuth<MealOrderParamsByAdmin>(
  async (req, context, user) => {
    const { mealId, userId } = await context.params;
    const body = await req.json();
    const parseResult = mealLogSchemaInput.safeParse(body);
    if (!parseResult.success) {
      return ApiResponse.zodError(parseResult.error);
    }
    const mealLogData = parseResult.data;
    const adminId = String(user?._id);
    const response = await markMealTakenAndUpdateAccountBalance(mealLogData, {
      adminId,
      mealId,
      userId,
    });
    if (!response) {
      return ApiResponse.error("Failed to order meal");
    }

    return ApiResponse.success(
      `Meal marked as taken successfully for user ${userId}`,
      { mealLog: response }
    );
  },
  { requiredRole: UserRole.admin }
);
