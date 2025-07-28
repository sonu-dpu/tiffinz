import { UserRole } from "@/constants/enum";
import { verifyUser, verifyUsers } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

// export const PATCH = withAuth(async()=>{}, {requiredRole:UserRole.admin})
type UserIdParams = {id:string}
export const PATCH = withAuth<UserIdParams>(async(req, context)=>{
  const {id:userId} = await context.params ;
  const body = !userId ? await req.json() : null;
  const userIds = body?.userIds;
  if(!userIds && !userId){
    return ApiResponse.error("User id not provided", 400);
  }
  if(userId.trim()){
    const {verifiedUser, userAccount} = await verifyUser(userId);
    return ApiResponse.success("User verified and accoun created", {user: verifiedUser, account: userAccount}, 200)
  }
  const verifiedUsersCount = await verifyUsers(userIds);
  return ApiResponse.success(`Verified users ${userIds.length}/${verifiedUsersCount}`, {verifiedUsersCount}, 200)
}, {requiredRole:UserRole.admin})