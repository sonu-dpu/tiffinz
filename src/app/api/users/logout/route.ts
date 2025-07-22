import { logoutUser } from "@/helpers/server/user.auth";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(async(req)=>{
  return await logoutUser(req);
})