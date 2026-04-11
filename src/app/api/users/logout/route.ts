import { logoutUser } from "@/helpers/server/user.auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { cookies } from "next/headers";

export const GET = asyncHandler(async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _cookieStore = await cookies();
  await logoutUser();
  return ApiResponse.success("Logged out successfully");
});
