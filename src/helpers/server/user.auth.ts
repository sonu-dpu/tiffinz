import { DEFAULT_AVATAR_URI } from "@/constants/constants";
import { UserRole } from "@/constants/enum";
import Session from "@/models/session.model";
import User, { IUser } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import generateRefreshAndAccessToken from "@/utils/generateTokens";

import {
  ILoginCredentials,
  loginWithEmailSchema,
  loginWithPhoneSchema,
  loginWithUsernameSchema,
} from "@/zod/user.login.schema";
import { NextRequest } from "next/server";

export async function registerUser(userData: IUser) {
  // Check if user exists
  const orConditions: Array<Record<string, string>> = [
    { phone: userData.phone },
    { username: userData.username },
  ];
  console.log("userData.email", userData.email);
  if (userData.email) {
    orConditions.push({ email: userData.email });
  }
  await connectDB();
  const existingUser = await User.findOne({ $or: orConditions });
  if (existingUser) {
    const credential =
      existingUser?.email && existingUser.email === userData.email
        ? "Email"
        : "Phone/Username";
    throw new ApiError(`User with ${credential} already registered`, 409);
  }

  const newUser: IUser = {
    username: userData.username,
    fullName: userData.fullName,
    phone: userData.phone,
    avatar: userData.avatar || DEFAULT_AVATAR_URI,
    password: userData.password,
    role: userData.role,
    isVerified: userData.role === UserRole.admin,
    ...(userData.email && { email: userData.email }),
  };

  const userDoc = await User.create(newUser);
  const createdUser = await User.findById(userDoc._id).select("-password");
  if (!createdUser) {
    throw new ApiError("Failed to register user", 500);
  }
  return createdUser;
}

type LoginOption = {
  key: keyof ILoginCredentials;
  schema:
    | typeof loginWithEmailSchema
    | typeof loginWithPhoneSchema
    | typeof loginWithUsernameSchema;
};

const loginOptions: LoginOption[] = [
  {
    key: "email",
    schema: loginWithEmailSchema,
  },
  {
    key: "username",
    schema: loginWithUsernameSchema,
  },
  {
    key: "phone",
    schema: loginWithPhoneSchema,
  },
];

async function loginUser(
  key: "email" | "username" | "phone",
  value: string,
  password: string
) {
  const query: Record<string, string> = {};
  query[key] = value;
  await connectDB();
  const user = await User.findOne(query);
  if (!user) {
    console.log("query", query);
    throw new ApiError(`User with ${key} not found`, 404);
  }

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError("Invalid credentials", 401);
  }
  console.log("user", user);
  return { user };
}

const cookieFlags = {
  sameSite: true,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

async function createUserSession(userId: string) {
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    userId
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError("Failed to generate tokens", 500);
  }

  const userSession = await Session.findOneAndUpdate(
    { user: userId },
    { refreshToken },
    { upsert: true, new: true }
  );

  if (!userSession) {
    throw new ApiError("Session creation failed", 500);
  }

  const user = await User.findById(userId).select("-password");

  // Set cookies
  const response = ApiResponse.success("User logged in successfully", { user });
  response.cookies
    .set("accessToken", accessToken, cookieFlags)
    .set("refreshToken", refreshToken, cookieFlags);

  return response;
}

async function logoutUser(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    console.log("refreshToken not found in cookies");
    return ApiResponse.success("User already logged out");
  }

  await connectDB();
  const deletedSession = await Session.findOneAndDelete({ refreshToken });

  if (!deletedSession) {
    console.log("Session not found — probably already logged out");
    // Proceed anyway
  }

  const res = ApiResponse.success("User logged out");
  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");
  return res;
}

export { logoutUser, createUserSession, loginOptions, loginUser };
