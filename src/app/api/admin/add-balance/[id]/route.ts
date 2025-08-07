import { UserRole } from "@/constants/enum";
import { getBalanceRequestDetailsById } from "@/helpers/server/admin.add-balance";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth<{ id: string }>(async(_req, context)=>{
    const { id: reqId } = await context.params;
    const request = await getBalanceRequestDetailsById(reqId);
    return ApiResponse.success("Fetched user successfully", { request }, 200);
}, {requiredRole: UserRole.admin});