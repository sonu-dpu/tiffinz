import { PaymentStatus, TransactionType } from "@/constants/enum";
import Account, { IAccount } from "@/models/account.model";
import AddBalanceRequest, {
  IAddBalanceRequest,
} from "@/models/addBalanceRequest.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { isValidObjectId } from "mongoose";

async function verifyBalanceRequest(
  reqId: string,
  status: PaymentStatus = PaymentStatus.approved
) {
  if (!isValidObjectId(reqId)) {
    throw new ApiError("Invalid request id", 400);
  }
  await connectDB();
  const reqDoc: IAddBalanceRequest | null =
    await AddBalanceRequest.findByIdAndUpdate(
      reqId,
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );
  if (!reqDoc || reqDoc.status !== status) {
    throw new ApiError("Failed to update the request status");
  }

  return reqDoc;
}

/**
 * Updates the balance of a user's account by a specified amount.
 *
 * @param userId - The ID of the user whose account balance will be updated.
 * @param amount - Amount to add (positive) or deduct (negative).
 * @param accountId - (Optional) The specific account ID to update. If not provided, the user's default account is used.
 * @returns An object containing the type of transaction performed (`credit` or `debit`) and the updated account.
 * @throws {ApiError} If the provided userId or accountId is invalid, or if the user account is not found.
 */
async function updateAccountBalance(
  userId: string,
  amount: number,
  accountId?: string
) {
  if (accountId && !isValidObjectId(accountId)) {
    throw new ApiError("Invalid account id", 400);
  } else if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user id", 400);
  }
  const userAccount: IAccount | null = await Account.findOne({
    user: userId,
    ...(accountId && { _id: accountId }),
  });
  if (!userAccount) {
    throw new ApiError("User account not found", 404);
  }
  let updateType: TransactionType = TransactionType.debit;

  userAccount.balance += amount;
  updateType = amount > 0 ? TransactionType.credit : TransactionType.debit;

  await userAccount.save({ validateBeforeSave: false });
  return { updateType, account: userAccount };
}
async function getBalanceRequestDetailsById(reqId: string) {
  if (!isValidObjectId(reqId)) {
    throw new ApiError("Invalid request id", 400);
  }
  await connectDB();
  const request = await AddBalanceRequest.findById(reqId)
    .populate("user", "fullName email")
    .populate("verifiedBy", "fullName email");
  if (!request) {
    throw new ApiError("Request not found", 404);
  }
  return request;
}



export { verifyBalanceRequest, updateAccountBalance,getBalanceRequestDetailsById };
