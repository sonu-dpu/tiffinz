import { JWTPayload, jwtVerify } from "jose";
import { JOSEError } from "jose/errors";
import { ApiError } from "./apiError";
// import { handleError } from "./handleError";
type verifyJWTResponse = Promise<{
  payload: JWTPayload | null;
  error: string | unknown | null;
}>;
type verifyType = "access" | "refresh";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET
export async function verifyJWT(
  token: string,
  verifyType: verifyType = "access"
): verifyJWTResponse {
  try {
    if(!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET){
      throw new ApiError("secrets not found", 500)
    }
    const encoder = new TextEncoder();
    let secret = encoder.encode(ACCESS_TOKEN_SECRET);
    if (verifyType === "refresh") {
      secret = encoder.encode(REFRESH_TOKEN_SECRET);
    }
    const { payload } = await jwtVerify(token, secret);
    return { payload, error: null };
  } catch (error) {
    let errorMessage: string | unknown;
    if (error instanceof JOSEError) {
      errorMessage = error.message;
    }
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log('JWT Error', errorMessage)
    return { payload: null, error: errorMessage };
  }
}
