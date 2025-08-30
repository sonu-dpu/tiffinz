import Transaction from "@/models/transaction.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(async (req, _context,user )=>{
  const searchParams = req.nextUrl.searchParams;
  const options = {
    limit:Number(searchParams.get("limit")),
  }
  const userId = user?._id;
  const transactions = await Transaction.find({user:userId}).limit(options.limit)
  return ApiResponse.success("transactions fetched",{transactions})
})