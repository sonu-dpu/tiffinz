import { DEFAULT_AVATAR_URI } from "@/constants/constants";
import { UserRole } from "@/constants/enum";
import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import User, { IUser } from "@/models/user.model";
import { userSchema } from "@/zod/user.schema";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiError";

export const POST = asyncHandler(async (req) => {
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

  await connectDB(); //db connection

  // conditions for finding user by phone, username, email if provided
  const orConditions: Array<Record<string, string>> = [
    { phone: userData.phone },
    { username: userData.username },
  ];

  if (userData?.email) {
    orConditions.push({ email: userData.email });
  }
  const existingUser = await User.findOne({ $or: orConditions }); //checking if user already exists or not

  if (existingUser) {
    const credential = userData?.email ? "Email" : "phone number/username";
    return ApiResponse.error(`User with ${credential} already registered`);
  }

  // console.log(userData?.email);
  const newUser: IUser = {
    username: userData.username,
    fullName: userData.fullName,
    phone: userData.phone,
    avatar: userData.avatar || DEFAULT_AVATAR_URI,
    password: userData.password,
    role: userData.role,
    isVeriffied: userData.role === UserRole.admin,
    ...(userData?.email && { email: userData.email }),
  };
  const userDoc = await User.create(newUser);
  const createdUser = await User.findById(userDoc._id).select("-password");
  if (!createdUser) {
    throw new ApiError("Failed to register user", 400);
  }
   const userType = userData.role === UserRole.admin ? "Admin" : "User"
  return ApiResponse.success(`${userType} registered successfully `,
    { user: createdUser },
    201);
});
