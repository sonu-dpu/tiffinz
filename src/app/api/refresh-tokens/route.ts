import { getUserById } from "@/helpers/server/admin.user";
import { createUserSession } from "@/helpers/server/user.auth";
import { asyncHandler } from "@/utils/asyncHandler";
import { verifyJWT } from "@/utils/verifyJWT";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (req) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const { payload, error } = await verifyJWT(refreshToken, "refresh");
  const id = payload?._id;
  if (error || !id) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("accessToken").delete("refreshToken");
    return response;
  }
  const userExists = await getUserById(id as string);
  if (!userExists) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("accessToken").delete("refreshToken");
    return response;
  }
  return await createUserSession(userExists.id);
});
