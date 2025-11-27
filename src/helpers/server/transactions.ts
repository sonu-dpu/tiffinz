import Transaction, { ITransaction } from "@/models/transaction.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { PaginateOptions, PipelineStage, Types } from "mongoose";
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

async function getTransactionById(transactionId: string, userId?: string) {
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
  const transaction = await Transaction.findOne(query)
    .populate("mealLog")
    .populate({ path: "mealLog", populate: { path: "meal" } })
    .populate({ path: "mealLog", populate: { path: "extras.extras" } });
  if (!userId) {
    await transaction?.populate({ path: "user", select: "-password" });
  }

  if (!transaction) {
    throw new ApiError("Transaction not found", 404);
  }
  return transaction;
}

async function getUserTransactions(userId: string, options: PaginateOptions) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid User id");
  }
  await connectDB();
  const transactions = await Transaction.aggregatePaginate(
    [{ $match: { user: new Types.ObjectId(userId) } }],
    { ...options, customLabels: { docs: "transactions" } }
  );
  return transactions;
}

// using agggregation pipeline in this function
async function getTransactionWithPopuplatedFields(
  transactionId: string,
  userId?: string
) {
  if (!isValidObjectId(transactionId)) {
    throw new ApiError("Invalid Transaction ID");
  }
  if (userId && !isValidObjectId(userId)) {
    throw new ApiError("Invalid User ID");
  }
  await connectDB();
  const pipeline: PipelineStage[] = [
    {
      $match: {
        _id: new Types.ObjectId(transactionId),
        ...(userId && { user: new Types.ObjectId(userId) }),
      },
    },
    ...(userId
      ? [
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
        ]
      : []),
    {
      $lookup: {  
        from: "meallogs",
        localField: "mealLog",
        foreignField: "_id",
        as: "mealLog",
        pipeline: [
          {
            $lookup: {
              from: "meals",
              localField: "meal",
              foreignField: "_id",
              as: "meal",
            },
          },
          {
            $lookup: {
              from: "meals",
              localField: "extras.extras",
              foreignField: "_id",
              as: "populatedExtras",
            },
          },
          {
            $addFields:{
              extras:{
                $map:{
                  input: "$extras",
                  as: "extraItem",
                  in:{
                    quantity: "$$extraItem.quantity",
                  },
                },
              }
            }
          }
          
        ],
      },
    },
  ];
  const transaction = await Transaction.aggregate(pipeline);
  if (transaction.length === 0) {
    throw new ApiError("Transaction not found", 404);
  }
  return transaction[0];
}

export { createTransaction, getTransactionById, getUserTransactions, getTransactionWithPopuplatedFields };
