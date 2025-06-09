import Account, { IAccount } from "@/models/account.model";
import AddBalanceRequest from "@/models/addBalanceRequest.model";
import User from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { handleError } from "@/utils/handleError";
import { AddBalanceRequestInput } from "@/zod/addBalanceRequest.schema";
import { isValidObjectId } from "mongoose";

async function doesUserAccountExist(
  userId: string
): Promise<boolean | IAccount> {
  try {
    await connectDB();
    const existingAccount = await Account.findOne({ userId });
    return !!existingAccount;
  } catch (error) {
    throw handleError(error);
  }
}

async function createAccount(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid User ID", 400);
  }
  await connectDB();
  const existingAccount = await doesUserAccountExist(userId);
  if (existingAccount) {
    throw new ApiError("Account already exists", 400);
  }
  const newAccount: IAccount = await Account.create({ userId, balace: 0 });
  if (!newAccount) {
    throw new ApiError("Failed to create new user account", 500);
  }
  return newAccount;
}

async function addBalanceRequest(requestData: AddBalanceRequestInput) {
  const userId = requestData.userId;
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid object id", 400);
  }
  await connectDB();
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError("User does not exists");
  }
  const balanceReqDoc = await AddBalanceRequest.create(requestData);
  if (!balanceReqDoc) {
    throw new ApiError("Failed to create balance request ", 500);
  }
  return balanceReqDoc;
}
export { createAccount, doesUserAccountExist, addBalanceRequest };
