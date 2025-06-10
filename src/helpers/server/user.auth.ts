import { ApiResponse } from "@/utils/ApiResponse";
import { handleError } from "@/utils/handleError";

async function logoutUser() {
  try {
    const res = ApiResponse.success("User logged out");
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  } catch (error) {
    throw handleError(error);
  }
}

export { logoutUser };
