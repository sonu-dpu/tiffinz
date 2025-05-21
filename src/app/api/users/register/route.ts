import { DEFAULT_AVATAR_URI } from "@/constants/constants";
import { UserRole } from "@/constants/enum";
import { ApiResponse } from "@/lib/ApiResponse";
import connectDB from "@/lib/dbConnect";
import User, { IUser } from "@/models/user.model";
import { userSchema } from "@/zod/user.schema";
import { MongooseError } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("HEllo  ");
    const connection = await connectDB();
    console.log(`Db connection success host:${connection.host}`);

    return ApiResponse.success(
      "DB connected success fully",
      { host: connection.host },
      200
    );
  } catch (error) {
    console.error("Connect failed ", error);
    return ApiResponse.error(`Failed to connect with DB`, 500, error);
  }
}

export async function POST(req: NextRequest) {
  const body: typeof userSchema = await req.json();
  const parseResult = userSchema.safeParse(body);
  if (!parseResult.success) {
    return ApiResponse.zodError(parseResult.error);
  }
  const userData = parseResult.data;

  if (
    userData.role === UserRole.admin &&
    userData?.adminSecret !== process.env.ADMIN_SECRET!
  ) {
    console.info(
      `Invalid Secret, registering user with default user previleges user fullName:${userData.fullName}`
    );
    userData.role = UserRole.user;
  }
  try {
    await connectDB();
    const existingUser = await User.findOne({ phone: userData.phone });
    if (existingUser) {
      return ApiResponse.error("User with phone number already registered");
    }

    console.log(userData?.email);
    const newUser: IUser = {
      username: userData.username,
      fullName: userData.fullName,
      phone: userData.phone,
      avatar: userData.avatar || DEFAULT_AVATAR_URI,
      password: userData.password,
      role: userData.role,
      ...(userData?.email && { email: userData.email }),
    };
    const userDoc = await User.create(newUser);
    const createdUser = await User.findById(userDoc._id).select("-password");
    if (!createdUser) {
      throw ApiResponse.error("Failed to register user", 500);
    }
    return ApiResponse.success(
      `User ${userData.role === UserRole.admin && "Admin"} registered successfully `,
      { user: createdUser },
      201
    );
  } catch (error) {
    // console.log(error)
    if (error instanceof MongooseError) {
      return ApiResponse.error(error.message, 400);
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return ApiResponse.error(message, 500);
  }
}
