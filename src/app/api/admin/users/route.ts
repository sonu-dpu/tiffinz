import { UserRole } from "@/constants/enum";
import { createUserByAdmin, getAllUsers, GetUserOptions } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
// import { asyncHandler } from "@/utils/asyncHandler";
import { withAuth } from "@/utils/withAuth"
import { createUserByAdminSchema } from "@/zod/user.schema";

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



// create new user
/*
- creates new user with auto generated temporary password
- requires admin secret
- returns user object
*/
export const POST = withAuth(async (req) => {
  const body = await req.json();
  const parseResult = createUserByAdminSchema.safeParse(body);
  if(parseResult.success === false){
    return ApiResponse.zodError(parseResult.error);
  }
  const user = await createUserByAdmin(parseResult.data);
  if (!user) {
    return ApiResponse.error("User not found", 404);
  }
  return ApiResponse.success("User fetched successfully", { user }, 200);
}, 
{requiredRole:UserRole.admin})
