import { handleApiError } from "@/utils/handleError";
import { NextRequest } from "next/server";

export function asyncHandler(handler: (req: NextRequest) => Promise<Response>) {
  return async function (req: NextRequest) {
    try {
      return await handler(req);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
