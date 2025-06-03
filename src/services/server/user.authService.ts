import { handleError } from "@/utils/handleError";
import { NextResponse } from "next/server";

async function logoutUser() {
  try {
    const res = NextResponse.json("User logged out");
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  } catch (error) {
    throw handleError(error);
  }
}

export { logoutUser };
