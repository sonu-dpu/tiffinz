import { PaymentStatus, TransactionType } from "@/constants/enum";
import Account, { IAccount } from "@/models/account.model";
import AddBalanceRequest, {
  IAddBalanceRequest,
} from "@/models/addBalanceRequest.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { isValidObjectId} from "mongoose";

async function verifyBalanceRequest(
  reqId: string,
  status: PaymentStatus = PaymentStatus.pending
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
}


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
  const userAccount:IAccount | null = await Account.findOne({
    user: userId,
    ...(accountId && { _id: accountId }),
  });
  if (!userAccount) {
    throw new ApiError("User account not found", 404);
  }
  let updateType : TransactionType = TransactionType.debit;
  if (amount > 0) {
    updateType = TransactionType.credit;
    userAccount.balance += amount;
  } else if (amount < 0) {
    updateType = TransactionType.debit;
    userAccount.balance += amount;
  }
  await userAccount.save({validateBeforeSave:false})
  return {updateType, account: userAccount}
}

export { verifyBalanceRequest, updateAccountBalance };
