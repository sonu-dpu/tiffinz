import { UserRole } from "@/constants/enum";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "./handleError";

import { verifyJWT } from "./verifyJWT";
import { ApiError } from "./apiError";

export function isAdmin(req: NextResponse) {
  const userRole = req.headers.get("x-user-role") || null;
  console.log("userRole", userRole);
  return userRole === UserRole.admin;
}

// higher order function to check if user is admin
export function  withAdminAuth<T>(
  callback: (req: NextRequest, params?: T) => Promise<Response>
) {
  return async function (req: NextRequest, context?: { params?: T }) {
    try {
      const token = req.cookies.get("accessToken")?.value;
      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const { payload, error } = await verifyJWT(token);
      if (error || !payload) {
        throw error || new ApiError("Invalid token", 401);
      }

      if (payload.role !== UserRole.admin) {
        throw new ApiError("Access denied to admin resources", 403);
      }

      return await callback(req, context?.params);
    } catch (error) {
      return handleError(error);
    }
  };
}

