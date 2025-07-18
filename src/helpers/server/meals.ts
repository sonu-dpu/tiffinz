import connectDB from "@/utils/dbConnect";
import Meal, { IMeal } from "@/models/meal.model";
import { ApiError } from "@/utils/apiError";
import mongoose, { isValidObjectId } from "mongoose";
import { UpdateMealInput } from "@/zod/meals.schema";
import { MealLogSchemaInputType } from "@/zod/mealLog.schema";
import MealLog from "@/models/mealLogs.model";
//DELETE
async function deleteMealById(id: string) {
  if (!isValidObjectId(id)) {
    throw new ApiError("Invalid Meal Id", 400);
  }
  await connectDB();

  const meal = await Meal.findById(id);
  if (!meal) {
    console.warn(`Attempt to delete non-existent meal with ID: ${id}`);
    throw new ApiError("Meal does not exists", 404);
  }
  await meal.deleteOne();
  return true;
}

async function deleteMealByIds(ids: string[]): Promise<number> {
  console.log("ids", ids);
  if (!Array.isArray(ids) || (Array.isArray(ids) && ids.length === 0)) {
    throw new ApiError("No Meal IDs provided", 400);
  }
  const invalidIds = ids.filter((id) => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid IDs: ${invalidIds.join(", ")}`, 400);
  }
  await connectDB();
  const { deletedCount } = await Meal.deleteMany({
    _id: { $in: ids },
  });

  if (deletedCount === 0) {
    throw new ApiError("No meals were deleted", 404);
  }

  return deletedCount;
}

//GET
async function getAllMeals() {
  await connectDB();
  const meals = await Meal.find();
  return meals;
}

async function getMealById(id: string) {
  await connectDB();
  if (!isValidObjectId(id)) {
    throw new ApiError("Invalid mealId", 400);
  }
  const meal = await Meal.findById(id);
  if (!meal) {
    throw new ApiError("Meal with id not found", 404);
  }
  console.log(meal);
  return meal;
}

//UPDATE

async function updateMeal(id: string, mealData: UpdateMealInput) {
  if (!isValidObjectId(id)) {
    throw new ApiError("Invalid Meal id", 400);
  }
  await connectDB();
  const updatedMeal = await Meal.findByIdAndUpdate(id, mealData, { new: true });

  if (!updatedMeal) {
    throw new ApiError("Meal not found", 404);
  }

  return updatedMeal;
}

async function orderMeal(
  mealData: MealLogSchemaInputType,
  userId: string,
  mealId: string
) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user id", 400);
  }
  if (!isValidObjectId(mealId)) {
    throw new ApiError("Invalid meal id", 400);
  }
  await connectDB();

  const meal: IMeal | null = await Meal.findById(mealId);
  if (!meal) {
    throw new ApiError("Meal not found", 404);
  }
  const mealLogDoc = {
    ...mealData,
    user: userId,
    meal: meal._id,
    totalAmount: meal.price,
  };
  const mealLog = await MealLog.create(mealLogDoc);
  if (!mealLog) {
    throw new ApiError("Failed to order meal", 500);
  }
  return mealLog;
}

async function getMealLogById(mealLogId: string) {
  if (!isValidObjectId(mealLogId)) {
    throw new ApiError("Invalid meal log id");
  }
  const mealLog = await MealLog.findById(mealLogId)
    .populate("meal")
    .populate("extras.etxras");
  if (!mealLog) {
    throw new ApiError("Meal log not found", 404);
  }
  return mealLog;
}
// async function getAllMealLogs() {
//   await connectDB();
//   const mealLogs = await MealLog.find().populate("mealId").populate("extras.extrasId");
//   if(!mealLogs){
//     throw new ApiError("Meal log not found", 404)
//   }
//   return mealLogs.map((log) => ({
//     ...log.toObject(),
//     priceBreakdown: log.priceBreakdown,
//   }));
// }

interface paginationParams {
  page?: number;
  limit?: number;
}
export interface ISearchQuery {
  userId?: string;
  username?: string;
  start?: string;
  end?: string;
  sortType?: "asc" | "desc";
}
async function getAllMealLogsAggregate(
  query: ISearchQuery = {
    start: "",
    end: "",
    userId: "",
    username: "",
    sortType: "desc",
  },
  options: paginationParams = { page: 1, limit: 10 }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match = {} as Record<string, any>;

  if (query.userId) {
    if (!isValidObjectId(query?.userId)) {
      throw new ApiError("Invalid userId", 400);
    }
    match.user = new mongoose.Types.ObjectId(query.userId);
  }
  if (query?.start || query?.end) {
    if (query.start && !query.end) {
      match.createdAt = { $gte: new Date(query.start) };
    } else if (!query.start && query.end) {
      match.createdAt = { $lte: new Date(query.end) };
    } else {
      match.createdAt = {
        $gte: new Date(String(query?.start)),
        $lte: new Date(String(query?.end)),
      };
    }
  }
  await connectDB();
  const meals = await MealLog.aggregatePaginate(
    [
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullname: 1,
                email: 1,
                role: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "mealId",
          foreignField: "_id",
          as: "meal",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                type: 1,
                price: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "meals",
          let: { extrasArray: "$extras" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$extrasArray.extrasId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                price: 1,
                quantity: 1,
              },
            },
          ],
          as: "populatedExtras",
        },
      },
      {
        $addFields: {
          extras: {
            $map: {
              input: "$extras",
              as: "extraItem",
              in: {
                quantity: "$$extraItem.quantity",
                details: {
                  $first: {
                    $filter: {
                      input: "$populatedExtras",
                      as: "populated",
                      cond: {
                        $eq: ["$$populated._id", "$$extraItem.extrasId"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $unset: ["user", "mealId", "populatedExtras"],
      },
      {
        $addFields: {
          user: { $first: "$user" },
          meal: { $first: "$meal" },
        },
      },
    ],
    {
      ...options,
      customLabels: {
        docs: "mealLogs",
        totalDocs: "total",
      },
    }
  );

  return meals;
}

async function getAllMealLogs(
  query: ISearchQuery = {
    start: "",
    end: "",
    userId: "",
    username: "",
    sortType: "desc",
  },
  options: paginationParams = { page: 1, limit: 10 }
) {
  const match = {} as Record<string, any>;

  if (query.userId) {
    if (!isValidObjectId(query?.userId)) {
      throw new ApiError("Invalid userId", 400);
    }
    match.user = new mongoose.Types.ObjectId(query.userId);
  }
  if (query?.start || query?.end) {
    if (query.start && !query.end) {
      match.createdAt = { $gte: new Date(query.start) };
    } else if (!query.start && query.end) {
      match.createdAt = { $lte: new Date(query.end) };
    } else {
      match.createdAt = {
        $gte: new Date(String(query?.start)),
        $lte: new Date(String(query?.end)),
      };
    }
  }
  await connectDB();
  const mealLogs = await MealLog.find(match)
    .populate({path:"user", select:"username fullName email"})
    .populate("meal")
    .populate("extras.extras")
  if (mealLogs.length === 0) {
    throw new ApiError("No meal logs found", 400);
  }
  const mealLogsWithVirtuals = mealLogs.map((log) =>
    log.toObject({ virtuals: true })
  );
  return mealLogsWithVirtuals;
}
export {
  deleteMealById,
  deleteMealByIds,
  getAllMeals,
  getMealById,
  updateMeal,
  orderMeal,
  getMealLogById,
  getAllMealLogs,
  getAllMealLogsAggregate,
};
