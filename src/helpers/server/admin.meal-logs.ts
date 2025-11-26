import { MealStatus } from "@/constants/enum";
import Meal, { IMeal } from "@/models/meal.model";
import MealLog from "@/models/mealLogs.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { MealLogSchemaInputType } from "@/zod/mealLog.schema";
import { isValidObjectId, Types } from "mongoose";
import { ITransaction } from "@/models/transaction.model";
import { createTransaction } from "./transactions";
import { updateAccountBalance } from "./admin.add-balance";
import { handleError } from "@/utils/handleError";

type createMealOptions = {
  userId: string;
  mealId: string;
  adminId: string;
  mealStatus?: MealStatus;
  description?: string;
};
async function createMealLog(
  mealData: MealLogSchemaInputType,
  { adminId, mealId, mealStatus = MealStatus.taken, userId }: createMealOptions
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
    status: mealStatus,
    updatedBy: adminId,
  };
  const mealLog = await MealLog.create(mealLogDoc);
  if (!mealLog) {
    throw new ApiError("Failed to order meal", 500);
  }
  return mealLog;
}

/*
- Marks meal as taken in meal logs
- Updates user's account balance by deducting meal cost
- Creates a transaction record for the meal deduction
*/
async function markMealTakenAndUpdateAccountBalance(
  mealLogData: MealLogSchemaInputType,
  { adminId, mealId, userId, description }: createMealOptions
) {
  try {
    const mealLog = await createMealLog(mealLogData, {
      mealId,
      adminId,
      userId,
      mealStatus: MealStatus.taken,
    });
    const { account: userAccount, updateType: transactionType } =
      await updateAccountBalance(userId, -mealLog.totalAmount);

    const transactionDoc: ITransaction = {
      account: userAccount._id,
      amount: mealLog.totalAmount,
      isMeal: true,
      type: transactionType,
      user: new Types.ObjectId(userId),
      mealLog: mealLog._id,
      ...(description && { description }),
    };
    const transaction = await createTransaction(transactionDoc);
    return {
      transactionId: transaction._id,
      userAccount,
      mealLog,
      transaction,
    };
  } catch (error) {
    throw handleError(error);
  }
}

export { createMealLog, markMealTakenAndUpdateAccountBalance };
