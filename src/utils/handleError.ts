import { MongooseError } from "mongoose";
import { ApiResponse } from "@/lib/ApiResponse";

export function handleApiError(error: unknown) {
  if (error instanceof MongooseError) {
    return ApiResponse.error(error.message, 400);
  }
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return ApiResponse.error(message, 500);
}
