import { UserRole } from "@/constants/enum";
import { NextRequest } from "next/server";
import { handleError } from "./handleError";
import { verifyJWT } from "./verifyJWT";
import { ApiError } from "./apiError";
import User, { IUser } from "@/models/user.model";
import connectDB from "./dbConnect";

type withAuthOptions = {
  requiredRole?: UserRole;
};// Define the RouteContext type to match Next.js expectations
type RouteContext<T = Record<string, never>> = {
  params: Promise<T>;
};

// Higher order function to check if user is authenticated
export function withAuth<T = Record<string, never>>(
  callback: (
    req: NextRequest,
    context: RouteContext<T>,
    user?: IUser
  ) => Promise<Response>,
  options?: withAuthOptions
) {
  return async function (req: NextRequest, context: RouteContext<T>) {
    try {
      const token = req.cookies.get("accessToken")?.value;
      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const { payload, error } = await verifyJWT(token);
      if (error || !payload) {
        throw error || new ApiError("Invalid token", 401);
      }
      const userId = payload?._id;
      await connectDB();
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new ApiError("User not found", 404);
      }
      if (
        options?.requiredRole &&
        user.role !== options.requiredRole &&
        user.role !== UserRole.admin
      ) {
        throw new ApiError("Access denied", 403);
      }

      return await callback(req, context, user);
    } catch (error) {
      return handleError(error);
    }
  };
}
