import { UserRole } from "@/constants/enum";
import { getAllUsers, GetUserOptions } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
// import { asyncHandler } from "@/utils/asyncHandler";
import { withAuth } from "@/utils/withAuth"

export const GET = withAuth(async (req) => {
    const searchParams = req.nextUrl.searchParams;
    const options: GetUserOptions = {};
    const isActive = searchParams.get("isActive");
    if (isActive !== null) {
      options.isActive = isActive === "true";
    }
    const isVerified = searchParams.get("verified");
    if (isVerified !== null) {
      options.isVerified = isVerified === "true";
    }
    const role = searchParams.get("role");
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      options.role = role as UserRole;
    }
    // console.log("options", options);

    await connectDB();
    const users = await getAllUsers(options);

    if (!users || users.length === 0) {
      return ApiResponse.error("No users found", 404);
    }
    return ApiResponse.success("Fetched users successfully", { users }, 200);
  },

  { requiredRole: UserRole.admin }
);
