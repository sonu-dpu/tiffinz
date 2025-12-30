import Transaction from "@/models/transaction.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import {
  isValidObjectId,
  PaginateOptions,
  PipelineStage,
  Types,
} from "mongoose";
type SearchOptions = {
  user?: string;
  month?: number;
  year?: number;
};
export async function getAllTransactions({
  paginateOptions,
  searchOptions,
}: {
  paginateOptions: PaginateOptions;
  searchOptions?: SearchOptions;
}) {
  console.log(searchOptions);
  if (searchOptions?.user?.trim() && !isValidObjectId(searchOptions?.user)) {
    throw new ApiError("Invalid user id", 400);
  }
  await connectDB();

  const match = {
    ...(searchOptions?.user && {
      user: new Types.ObjectId(searchOptions.user),
    }),
    ...(searchOptions?.month && { month: searchOptions.month }),
    ...(searchOptions?.year && { year: searchOptions.year }),
  };
  const stageToAddUser: PipelineStage[] = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              username: 1,
              _id: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $first: "$user" },
      },
    },
  ];
  const transactionsPipeline: PipelineStage[] = [
    {
      $match: {
        ...match,
      },
    },
  ];
  if (!searchOptions?.user) {
    transactionsPipeline.push(...stageToAddUser);
  }
  const transactions = await Transaction.aggregatePaginate(
    transactionsPipeline,
    paginateOptions
  );

  return transactions;
}
