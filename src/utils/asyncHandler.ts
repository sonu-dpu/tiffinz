import { handleError } from "@/utils/handleError";
import { NextRequest } from "next/server";

export function asyncHandler<T>(
  handler: (req: NextRequest, params?:  Promise<T> ) => Promise<Response>
) {
  return async function (req: NextRequest, context?: { params?: Promise<T> }) {
    try {
      return await handler(req, context?.params);
    } catch (error) {
      return handleError(error);
    }
  };
}
