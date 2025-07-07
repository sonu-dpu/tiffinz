import { PaymentStatus } from "@/constants/enum";
import { addBalanceRequest } from "@/helpers/server/user.account";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { addBalanceRequestSchema } from "@/zod/addBalanceRequest.schema";


export const POST = withAuth(async (req,_context, user) => {
  const body = await req.json();
  const userId = String(user?._id)
  if (!userId) {
    return ApiResponse.error("User id not found", 400);
  }
    console.log('body', body)
  const parseResult = addBalanceRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return ApiResponse.zodError(parseResult.error);
  }

  const reqData = {
    ...parseResult.data,
    userId: userId,
    status: PaymentStatus.pending,
    isVerified: false,
  };
  console.log('reqData', reqData)
  const reqDoc = await addBalanceRequest(reqData);
  if (!reqDoc) {
    return ApiResponse.error("Failed to create balance request", 500);
  }
  return ApiResponse.success(
    "Request initiated successfully",
    { request: reqDoc },
    200
  );
});
