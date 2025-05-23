import { handleApiError } from "@/utils/handleError";
import User from "@/models/user.model";

export default async function generateRefreshAndAccessToken(userId: string):Promise<{ accessToken: string; refreshToken: string }> {
  console.log("Generating tokens for userid ", userId);

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error while generating tokens", error);
    throw handleApiError(error)
  }
}
