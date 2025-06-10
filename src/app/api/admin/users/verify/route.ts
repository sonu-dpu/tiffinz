import { UserRole } from "@/constants/enum";
import { verifyUsers } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

// export const PATCH = withAuth(async()=>{}, {requiredRole:UserRole.admin})

export const PATCH = withAuth(async(req)=>{
  const body = await req.json();
  const userIds = body?.userIds;
  if(!userIds){
    return ApiResponse.error("User ids not provided", 400);
  }
  const verifiedUsersCount = await verifyUsers(userIds);
  return ApiResponse.success(`Verified users ${userIds.length}/${verifiedUsersCount}`, {verifiedUsersCount}, 200)
}, {requiredRole:UserRole.admin})