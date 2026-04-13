import { MealStatus, TransactionType, UserRole } from "@/constants/enum";
import { updateAccountBalance } from "@/helpers/server/admin.accounts";
import { getMealLogById } from "@/helpers/server/meals";
import { createTransactionDoc } from "@/helpers/server/transactions";
import Account from "@/models/account.model";
import MealLog from "@/models/mealLogs.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import { withAuth } from "@/utils/withAuth";
import { isValidObjectId, startSession } from "mongoose";

type MealLogParam = {
  mealLogId: string;
};
const getMealLogByIdRoute = withAuth<MealLogParam>(
  async (req, context) => {
    const { mealLogId } = await context.params;

    const mealLog = await getMealLogById(mealLogId);
    return ApiResponse.success("Fetched order successfully", {
      order: mealLog,
    });
  },
  { requiredRole: UserRole.admin },
);

const updateMealLogStatusRoute = withAuth<MealLogParam>(
  async (req, context) => {
    const { mealLogId } = await context.params;
    const body = await req.json();
    const status = body.status as MealStatus;
    if (!isValidObjectId(mealLogId)) {
      throw new ApiError("Invalid meal log id");
    }
    if (!(status.toLocaleLowerCase() in MealStatus)) {
      throw new ApiError("Invalid status");
    }

    await connectDB();
    const mealLog = await MealLog.findById(mealLogId);
    if (!mealLog) {
      throw new ApiError("Meal log not found", 404);
    }
    const session = await startSession();
    session.startTransaction();
    try {
      mealLog.status = status.toLocaleUpperCase() as MealStatus;
      let newTransaction = null;
      // if status is taken create a transaction and then upadte the user account balance
      if (status === MealStatus.taken) {
        const account = await Account.findOne({ user: mealLog.user }).session(
          session,
        );
        if (!account) {
          throw new ApiError("Account not found for the user", 404);
        }
        newTransaction = await createTransactionDoc({
          data: {
            account: account._id,
            user: mealLog.user,
            amount: mealLog.totalAmount,
            type: TransactionType.debit,
            mealLog: mealLog._id,
            isMeal: true,
          },
          session,
        });
        await updateAccountBalance({
          accountId: account,
          amount: newTransaction.amount,
          type: newTransaction.type,
          session,
        });
      }
      await mealLog.save({ session });
      await session.commitTransaction();
      return ApiResponse.success("Meal log status updated successfully", {
        mealLog,
        status,
        transaction: status === MealStatus.taken ? newTransaction : null,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Failed to update meal log status");
      throw error;
    }
  },
  { requiredRole: UserRole.admin },
);

export { getMealLogByIdRoute as GET, updateMealLogStatusRoute as PATCH };
