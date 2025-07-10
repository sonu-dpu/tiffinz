import Account, { IAccount } from "@/models/account.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { handleError } from "@/utils/handleError";
import { isValidObjectId } from "mongoose";

async function doesUserAccountExist(
  userId: string
): Promise<boolean | IAccount> {
  try {
    await connectDB();
    const existingAccount = await Account.findOne({ user:userId });
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
  console.log("creating user account with id", userId)
  const existingAccount = await doesUserAccountExist(userId);
  if (existingAccount) {
    throw new ApiError("Account already exists", 400);
  }
  const newAccount: IAccount = await Account.create({ user:userId, balace: 0 });
  if (!newAccount) {
    throw new ApiError("Failed to create new user account", 500);
  }
  return newAccount;
}

export { createAccount, doesUserAccountExist };
