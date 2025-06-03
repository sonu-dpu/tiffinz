import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import Session from "@/models/session.model";
import User from "@/models/user.model";
import generateRefreshAndAccessToken from "@/utils/generateTokens";
import {
  ILoginCredentials,
  loginWithEmailSchema,
  loginWithPhoneSchema,
  loginWithUsernameSchema,
} from "@/zod/user.login.schema";
import { asyncHandler } from "@/utils/asyncHandler";
type LoginOption = {
  key: "email" | "username" | "phone";
  schema: typeof loginWithEmailSchema | typeof loginWithPhoneSchema | typeof loginWithUsernameSchema;
  notFoundMsg: string;
};
const loginOptions: LoginOption[] = [
  {
    key: "email",
    schema: loginWithEmailSchema,
    notFoundMsg: "User with this email does not exist",
  },
  {
    key: "username",
    schema: loginWithUsernameSchema,
    notFoundMsg: "User with this username does not exist",
  },
  {
    key: "phone",
    schema: loginWithPhoneSchema,
    notFoundMsg: "User with this phone number does not exist",
  },
];

export const POST = asyncHandler(async (req) => {
  const body: ILoginCredentials = await req.json();
  let user = null;
  let data = null;

  for (const option of loginOptions) {
    if (option.key in body) {
      const parseResult = option.schema.safeParse(body);
      if (!parseResult.success) {
        return ApiResponse.zodError(parseResult.error);
      }
      await connectDB();
      data = parseResult.data;
      const query: Record<string, string> = {};
      query[option.key] = data[option.key];
      user = await User.findOne(query);

      if (!user) {
        return ApiResponse.error(option.notFoundMsg, 404);
      }
      break;
    }
  }
  if (!user) {
    return ApiResponse.error("No valid login identifier provided", 400);
  }
  console.log("user", user);
  const isValidPassword = await user.isPasswordCorrect(data?.password);
  if (!isValidPassword) {
    return ApiResponse.error("Invalid credentials", 401);
  }

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id);
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
  const loggedInUser = await User.findById(user._id).select("-password");
  const response = ApiResponse.success("User logged in successfully", {
    user: loggedInUser,
  });
  response.cookies
    .set("accessToken", accessToken, cookieFlags)
    .set("refreshToken", refreshToken, cookieFlags);

  return response;
});
