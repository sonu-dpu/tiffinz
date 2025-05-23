import { LoginType } from "@/constants/enum";
import { ApiResponse } from "@/lib/ApiResponse";
import connectDB from "@/lib/dbConnect";
import Session from "@/models/session.model";
import User from "@/models/user.model";
import generateRefreshAndAccessToken from "@/services/server/generateTokens";
import {
  ILoginCredentials,
  loginWithEmailSchema,
  loginWithPhoneSchema,
  loginWithUsernameSchema,
} from "@/zod/user.login.schema";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (req) => {
  const body: ILoginCredentials = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const loginType = searchParams.get("type")?.trim();
  if (
    loginType !== LoginType.email &&
    loginType !== LoginType.phone &&
    loginType !== LoginType.username
  ) {
    return ApiResponse.error("Invalid Login type", 400);
  }
  let user = null;
  let parseResult = null;
  let data = null;
  await connectDB();

  if (loginType === LoginType.email) {
    parseResult = loginWithEmailSchema.safeParse(body);
    if (!parseResult.success) {
      return ApiResponse.zodError(parseResult.error);
    }
    data = parseResult.data;
    user = await User.findOne({ email: data.email });
  } else if (loginType === LoginType.username) {
    parseResult = loginWithUsernameSchema.safeParse(body);
    if (!parseResult.success) {
      return ApiResponse.zodError(parseResult.error);
    }
    data = parseResult.data;
    user = await User.findOne({ username: data.username });
  } else {
    parseResult = loginWithPhoneSchema.safeParse(body);
    if (!parseResult.success) {
      return ApiResponse.zodError(parseResult.error);
    }
    data = parseResult.data;
    user = await User.findOne({ phone: data.phone });
  }

  if (!user) {
    return ApiResponse.error(`User with ${loginType} does not exists`, 404);
  }
  console.log("user", user);
  const isValidPassword = await user.isPasswordCorrect(data.password);
  if (!isValidPassword) {
    return ApiResponse.error("Invalid credentials", 401);
  }

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    user._id
  );
  if (!accessToken || !refreshToken) {
    return ApiResponse.error("Failed to generate tokens", 500);
  }
  const userSession = await Session.findOneAndUpdate(
    { userId: user._id },
    { refreshToken },
    { upsert: true, new: true }
  );
  if (!userSession) {
    return ApiResponse.error("Session creation failed", 500);
  }
  const cookieFlags = {
    sameSite: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  }; //60*60*24*7 & days in seconds
  const loggedInUser = await User.findById(user._id).select("-password")
  const response = ApiResponse.success("User logged in successfully",{user: loggedInUser});
  response.cookies
    .set("accessToken", accessToken, cookieFlags)
    .set("refreshToken", refreshToken, cookieFlags);

  return response;
});