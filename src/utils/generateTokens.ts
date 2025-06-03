import { handleError } from "@/utils/handleError";
import User from "@/models/user.model";

export default async function generateRefreshAndAccessToken(
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> {
  console.log("Generating tokens for userid ", userId);

  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error while generating tokens", error);
    throw handleError(error);
  }
}
