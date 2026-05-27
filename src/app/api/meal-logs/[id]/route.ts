import { UserRole } from "@/constants/enum";
import { getMealLogById } from "@/helpers/server/meals";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

const getMealLogByIdRoute = withAuth<{ id: string }>(
  async (req, context, user) => {
    const { id: mealLogId } = await context.params;
    const userId = user?._id ? String(user._id) : undefined;
    const isAdmin = user?.role === UserRole.admin;
    if (!isAdmin && !userId) {
      return ApiResponse.error("Unauthorized", 401);
    }
    // console.log(
    //   "Received request for meal log with id:",
    //   mealLogId,
    //   "by user:",
    //   userId,
    // );
    const mealLog = await getMealLogById(mealLogId, {
      userId,
      isAdmin: user?.role === UserRole.admin,
    });
    return ApiResponse.success("Fetched meal log successfully", mealLog);
  },
  { requiredRole: UserRole.user },
);

export const GET = getMealLogByIdRoute;
