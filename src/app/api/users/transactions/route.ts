import { getUserTransactions } from "@/helpers/server/transactions";
import Transaction from "@/models/transaction.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { PaginateOptions } from "mongoose";

export const GET = withAuth(async (req, _context, user) => {
  const searchParams = req.nextUrl.searchParams;
  const options: PaginateOptions = {
    limit: Number(searchParams.get("limit") || 10),
    page: Number(searchParams.get("page") || 1),
    sort: { createdAt: -1 },
  };
  const userId = user?._id;
  const transactions = await getUserTransactions(String(userId), options);
  return ApiResponse.success("transactions fetched", transactions);
});
