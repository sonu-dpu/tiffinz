import { UserRole } from "@/constants/enum"
import { getTransactionById, getTransactionWithPopuplatedFields } from "@/helpers/server/transactions";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth"

type GetTransactionIdParams = {
  id:string;
}
export const GET = withAuth<GetTransactionIdParams>(async (req, context)=>{
  const {id:transactionId}  = await context.params;
  if(!transactionId?.trim()){
    throw new ApiError("Provide a valid transaction id");
  }

  // const transaction = await getTransactionById(transactionId);
  const transaction = await getTransactionWithPopuplatedFields(transactionId)

  return ApiResponse.success("Transaction fetched successfully", {transaction})

}, {requiredRole: UserRole.admin})