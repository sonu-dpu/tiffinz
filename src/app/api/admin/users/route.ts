import { UserRole } from "@/constants/enum";
import { getAllUsers, GetUserOptions } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
// import { asyncHandler } from "@/utils/asyncHandler";
import { withAuth } from "@/utils/withAuth"

export const GET = withAuth(async (req) => {
    const searchParams = req.nextUrl.searchParams;
    const options: GetUserOptions = {};
    const isVerified = searchParams.get("verified");
    const role = searchParams.get("role") as UserRole | null;
    const countOnly = searchParams.get("count");
    if (isVerified !== null) {
      options.isVerified = isVerified === "true";
    }
    if(role) options.role=role;

    
    const users = await getAllUsers(options, countOnly==="true");

    if(countOnly==="true"){
      return ApiResponse.success("Fetched user count success", {users})
    }
    // if (!users || users.length === 0) {
    //   return ApiResponse.error("No users found", 404);
    // }
    return ApiResponse.success("Fetched users successfully", { users }, 200);
  },

  { requiredRole: UserRole.admin }
);
