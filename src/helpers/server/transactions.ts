import Transaction, { ITransaction } from "@/models/transaction.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { PaginateOptions, Types } from "mongoose";
import { isValidObjectId } from "mongoose";
async function createTransaction(transactionDoc: ITransaction) {
  if (!isValidObjectId(transactionDoc.account)) {
    throw new ApiError("Inavlid Account id");
  }
  if (!isValidObjectId(transactionDoc.user)) {
    throw new ApiError("Inavlid user id");
  }
  await connectDB();
  const newTransaction = await Transaction.create(transactionDoc);

  if (!newTransaction) {
    throw new ApiError("Failed to create a transaction");
  }
  return newTransaction;
}

async function getTransactionById({
  transactionId,
  userId,
}: {
  transactionId: string;
  userId?: string;
}) {
  if (!isValidObjectId(transactionId)) {
    throw new ApiError("Invalid Transaction ID");
  }
  if (userId && !isValidObjectId(userId)) {
    throw new ApiError("Invalid User id");
  }
  await connectDB();
  const query = {
    _id: transactionId,
    ...(userId && { user: userId }),
  };
  const transaction = await Transaction.findById(query).populate({
    path: "user",
    select: "-password",
  });

  if (!transaction) {
    throw new ApiError("Transaction not found", 404);
  }
  return transaction;
}

async function getUserTransactions(userId: string, options:PaginateOptions) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid User id");
  }
  await connectDB();
  const transactions = await Transaction.aggregatePaginate([
    { $match: { user: new Types.ObjectId(userId) } },
  ],  {...options, customLabels:{docs:"transactions"}});
  return transactions;
}

export { createTransaction, getTransactionById, getUserTransactions };
