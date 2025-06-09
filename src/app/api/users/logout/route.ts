import { logoutUser } from "@/helpers/server/user.auth";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(async()=>{
  return await logoutUser();
})