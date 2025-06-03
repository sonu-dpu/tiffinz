import { MongooseError } from "mongoose";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "./apiError";
import { JsonWebTokenError } from "jsonwebtoken";

export function handleError(error: unknown) {
  if (error instanceof MongooseError) {
    return ApiResponse.error(error.message, 400);
  }
  if(error instanceof ApiError){
    return ApiResponse.error(error.message, error.statusCode, error.errors)
  }
  if(error instanceof JsonWebTokenError){
    return ApiResponse.error(error.message, 401, error.stack)
  }
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return ApiResponse.error(message, 500);
}
