import { UserRole } from "@/constants/enum";
import MealLog from "@/models/mealLogs.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { Types } from "mongoose";
import { isValidObjectId } from "mongoose";

const getOrdersByUserId = withAuth<{ userId: string }>(
  async (req, context) => {
    const { userId } = await context.params;
    if (!isValidObjectId(userId)) {
      return ApiResponse.error("Invalid userId", 400);
    }

    const orders = await MealLog.aggregatePaginate([
      {
        $match: {
          user: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "meal",
          foreignField: "_id",
          as: "meal",
          pipeline: [
            {
              $project: {
                name: 1,
                price: 1,
              },
            },
          ],
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    return ApiResponse.success("test", orders);
  },
  {
    requiredRole: UserRole.admin,
  },
);

export { getOrdersByUserId as GET };
