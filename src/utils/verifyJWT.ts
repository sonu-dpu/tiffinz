import { JWTPayload, jwtVerify } from "jose";
import { JOSEError } from "jose/errors";
// import { handleError } from "./handleError";
type verifyJWTResponse = Promise<{
  payload: JWTPayload | null;
  error: string | unknown | null;
}>;
export async function verifyJWT(token: string): verifyJWTResponse {
  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
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
    return { payload: null, error: errorMessage };
  }
}
