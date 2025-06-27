import { ApiResponse } from "@/utils/ApiResponse";
// import connectDB from "@/utils/dbConnect";
// import User from "@/models/user.model";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(async (_req, _context, user) => {
  console.log('user', user)
  if(!user){
    return ApiResponse.error("No logged in user found", 400)
  }
  return ApiResponse.success("User fetched sucessfully", {user})
});
