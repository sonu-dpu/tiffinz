import { DailyMealFor, MealStatus, UserRole } from "@/constants/enum";
import MealLog from "@/models/mealLogs.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

const getOrders = withAuth(
  async (req) => {
    const searchParams = req.nextUrl.searchParams;
    const options = {
      status: searchParams.get("status")?.toLowerCase() as MealStatus,
      count: searchParams.get("count") === "true",
      mealFor: searchParams.get("mealFor")?.toLowerCase() as DailyMealFor,
    };

    if (!(options?.status in MealStatus)) {
      return ApiResponse.error("Invalid status", 400);
    }
    if (options.mealFor && !(options.mealFor in DailyMealFor)) {
      return ApiResponse.error("Invalid mealFor", 400);
    }
    if (options.count) {
      const count = await MealLog.countDocuments({
        status: options.status.toUpperCase(),
        ...(options.mealFor && { mealFor: options.mealFor.toUpperCase() }),
      });
      return ApiResponse.success(
        "Orders count fetched successfully",
        { count },
        200,
      );
    }

    const meals = await MealLog.aggregatePaginate([
      {
        $match: {
          status: options.status.toUpperCase(),
          ...(options.mealFor && { mealFor: options.mealFor.toUpperCase() }),
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "meal",
          foreignField: "_id",
          as: "meal",
        },
      },
      {
        $unwind: "$meal",
      },
    ]);
    return ApiResponse.success("Orders fetched successfully", meals, 200);
  },
  { requiredRole: UserRole.admin },
);

export { getOrders as GET };
