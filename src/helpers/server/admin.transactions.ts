import Transaction from "@/models/transaction.model";
import connectDB from "@/utils/dbConnect";
import { PaginateOptions, PipelineStage } from "mongoose";

export async function getAllTransactions({paginateOptions}:{paginateOptions:PaginateOptions}) {
  await connectDB();
  const transactionsPipeline:PipelineStage[] = [
    {
      $match:{}
    },
    {
      $lookup:{
        from:"users",
        localField:"user",
        foreignField:"_id",
        as:"user",
        pipeline:[
          {
            $project:{
              username:1,
              _id:1,
              fullName:1
            }
          }
        ]
      }
    },{
      $addFields:{
        user:{$first:"$user"}
      }
    }
  ]
  const transactions = await Transaction.aggregatePaginate(transactionsPipeline, paginateOptions);

  return transactions
}