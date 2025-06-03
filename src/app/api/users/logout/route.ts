import { logoutUser } from "@/services/server/user.authService";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(async()=>{
  return await logoutUser();
})