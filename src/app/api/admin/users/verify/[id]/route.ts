import { UserRole } from "@/constants/enum";
import { verifyUser} from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

// export const PATCH = withAuth(async()=>{}, {requiredRole:UserRole.admin})

type UserIdParams = {id:string}
export const PATCH = withAuth<UserIdParams>(async(_req, params)=>{
  const {id: userId} = await params as UserIdParams
  if(!userId){
    return ApiResponse.error("User ids not provided", 400);
  }
  const {verifiedUser, userAccount} = await verifyUser(userId);
  return ApiResponse.success("User verified and account created", {account: userAccount,user: verifiedUser })
}, {requiredRole:UserRole.admin})