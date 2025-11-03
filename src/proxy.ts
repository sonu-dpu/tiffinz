import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./utils/ApiResponse";
import { verifyJWT } from "./utils/verifyJWT";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const response = NextResponse.next();
  console.log('running proxy')
  if(!pathname.startsWith("/api") && !token){
    console.log('token not found')
    console.log('pathname', pathname)
    if(refreshToken){
      return NextResponse.redirect(new URL(`/refresh-session?redirect=${pathname.substring(1)}`, req.url));
    }
  }
  if (pathname.startsWith("/dashboard")) {
    // console.log("inside dashboard pathname", pathname);
    if (!token) {
      if(refreshToken){
        return NextResponse.redirect(new URL(`/refresh-session?redirect=${pathname.substring(1)}`, req.url));
      }
      return NextResponse.redirect(new URL(`/login?redirect=${pathname.substring(1)}`, req.url));
    }
  }

  if (
    pathname.startsWith("/api/users/register") ||
    pathname.startsWith("/api/user/logout")
  ) {
    return response;
  }
  if (pathname.startsWith("/api/users/login")) {
    return response;
  }
  if (pathname.startsWith("/api/refresh-tokens") && refreshToken) {
    return response;
  }
  if (pathname.startsWith("/api")) {
    console.log("inside /api pathname", pathname);
    if (!token) {
      return ApiResponse.error("Authentication required", 401);
    }

    const { payload, error } = await verifyJWT(token);
    if (pathname.startsWith("/api/refresh-tokens") && refreshToken && error) {
      return response;
    }
    if (error || !payload?._id) {
      return ApiResponse.error("Auhentication required", 401);
    }
    response.headers.set("x-user-id", String(payload?._id));
    response.headers.set("x-user-role", String(payload?.role));
    console.log("payload", payload);
  }

  // if(pathname.startsWith("/login") && !token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
  return response;
}

export const config = {
  matcher: ["/api/(.*)", "/dashboard", "/dashboard/:path", "/"],
};
