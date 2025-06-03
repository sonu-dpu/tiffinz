import Account, { IAccount } from "@/models/account.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { handleError } from "@/utils/handleError";
import { AddBalanceRequestInput, addBalanceRequestSchema } from "@/zod/addBalanceRequest.schema";
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

async function addBalanceRequest(reqData: AddBalanceRequestInput) {
  const parseResult = addBalanceRequestSchema.safeParse(reqData);
  if(!parseResult.success){
    throw parseResult.error;
  }

}
export { createAccount, doesUserAccountExist, addBalanceRequest };
