import { TransactionType } from "@/constants/enum";
import Account, { IAccount } from "@/models/account.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { handleError } from "@/utils/handleError";
import { UpdateUserAccountBalanceParams } from "@/zod/account.schema";
import { isValidObjectId } from "mongoose";
import { createTransaction } from "./transactions";

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

async function updateUserAccountBalance(data:UpdateUserAccountBalanceParams) {
  const {amount, accountId, userId, type, description} = data;
  if(!userId && !accountId){
    throw new ApiError("Either userId or accountId is required", 400);
  }
  if(accountId && !isValidObjectId(accountId)){
    throw new ApiError("Invalid Account ID", 400);
  }
  if(userId && !isValidObjectId(userId)){
    throw new ApiError("Invalid User ID", 400);
  }
  
  await connectDB()
  const account : IAccount= await Account.findOne({ user:userId }) as IAccount;
  if(!account){
    throw new ApiError("Account not found", 404);
  }
  if(type === TransactionType.credit){
    account.balance += amount;
  }else if(type === TransactionType.debit){
    account.balance -= amount;
  }else{
    throw new ApiError("Invalid transaction type", 400);
  }
  console.log('account', account)
  await account.save();
  const transaction = await createTransaction({
    amount,
    type,
    account: account._id,
    user: account.user,
    isMeal:false,
    ...(description && {description})
  });
  return {transaction};
}
export { createAccount, doesUserAccountExist, updateUserAccountBalance };
