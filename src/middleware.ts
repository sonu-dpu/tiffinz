import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./utils/ApiResponse";
import { verifyJWT } from "./utils/verifyJWT";


export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("accessToken")?.value;
  const response = NextResponse.next();
  if (pathname.startsWith("/api/users/login") && !token) {
    return response;
  }
  if (pathname.startsWith("/api")) {
    if (!token) {
      return ApiResponse.error("Authentication required", 401);
    }
    const { payload, error } = await verifyJWT(token);
    if (error || !payload?._id) {
      return ApiResponse.error("Auhentication required", 401)
    }
    response.headers.set("x-user-id", String(payload?._id));
    response.headers.set("x-user-role", String(payload?.role));
    console.log("payload", payload);
  }

  return response;
}

export const config = {
  matcher: ["/api/(.*)"],
};
