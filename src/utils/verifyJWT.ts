import { JWTPayload, jwtVerify } from "jose";
import { handleError } from "./handleError";
import { NextResponse } from "next/server";
type verifyJWTResponse = Promise<{
  payload: JWTPayload | null;
  error: NextResponse | null;
}>;
export async function verifyJWT(token: string): verifyJWTResponse {
  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return { payload, error: null };
  } catch (error) {
    const errorRespose = handleError(error);
    return { payload: null, error: errorRespose };
  }
}
