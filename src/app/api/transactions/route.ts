import Transaction from "@/models/transaction.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(async (_req, _context,user )=>{
  const userId = user?._id;
  const transactions = await Transaction.find({user:userId})
  return ApiResponse.success("transactions fetched",{transactions})
})