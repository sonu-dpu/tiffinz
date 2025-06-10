import { UserRole } from "@/constants/enum"
import { getUserById } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth"


type UserIdParams = {id: string}
export const GET = withAuth<UserIdParams>(async(_req, params)=>{
  const {id} = await params as UserIdParams;
  const user = await getUserById(id);
  return ApiResponse.success("User details fetched", {user})
}, {requiredRole: UserRole.admin})