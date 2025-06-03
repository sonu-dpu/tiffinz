import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import User from "@/models/user.model";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(async (req) => {
  const userId = req.headers.get("x-user-id");
  console.log(req.headers)
  if (!userId) {
    console.info("user id not found", userId);
    return ApiResponse.error("Authentication required", 401);
  }

  await connectDB();
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return ApiResponse.error("User not found", 404);
  }
  return ApiResponse.success("Fetched user details succcessfully", user);
});
