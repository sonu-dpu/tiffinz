import { JWTPayload, jwtVerify } from "jose";
import { JOSEError } from "jose/errors";
// import { handleError } from "./handleError";
type verifyJWTResponse = Promise<{
  payload: JWTPayload | null;
  error: string | unknown | null;
}>;
type verifyType = "access" | "refresh";
export async function verifyJWT(
  token: string,
  verifyType: verifyType = "access"
): verifyJWTResponse {
  try {
    const encoder = new TextEncoder();
    let secret = encoder.encode(process.env.ACCESS_TOKEN_SECRET!);
    if (verifyType === "refresh") {
      secret = encoder.encode(process.env.REFRESH_TOKEN_SECRET!);
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
