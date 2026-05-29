import { UserRole } from "@/constants/enum";
import User from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import mongoose, { isValidObjectId, PipelineStage } from "mongoose";
import { createAccount } from "./admin.accounts";
import { CreateUserByAdminInput } from "@/zod/user.schema";
import { doesUserAlreadyExist } from "./user.auth";
import { createHash, randomBytes } from "crypto";

export interface GetUserOptions {
  isActive?: boolean;
  isVerified?: boolean;
  role?: UserRole;
}
function generatePassword(length: number) {
  // generate a random password
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return password;
}
async function createUserByAdmin(userData: CreateUserByAdminInput) {
  const { error, exists } = await doesUserAlreadyExist(userData);
  if (exists) {
    throw new ApiError(
      error || "User registered with same credentials already",
      409,
    );
  }

  await connectDB();
  const password = userData.password ?? generatePassword(10);
  const userDoc = {
    ...userData,
    password,
    isVerified: true,
  };
  const user = await User.create(userDoc);
  await createAccount(user._id);
  if (!user) {
    throw new ApiError("Failed to create user", 500);
  }
  user.password = password;

  return user;
}

async function getAllUsers(
  options?: GetUserOptions,
  countOnly: boolean = false,
) {
  await connectDB();
  console.log("matcherQuery", options, countOnly);
  const pipeline: PipelineStage[] = [
    {
      $match: { ...options },
    },
  ];
  if (countOnly) {
    pipeline.push({ $count: "count" });
  } else {
    pipeline.push({ $unset: ["password"] });
  }
  const users = await User.aggregate(pipeline);
  if (countOnly) {
    return users.length > 0 ? users[0] : { count: 0 };
  }

  return users;
}

async function getUserById(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid User id");
  }
  await connectDB();
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return user;
}

async function getUserByIdWithAccount(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user id", 400);
  }
  await connectDB();
  const userWithAccount = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "_id",
        foreignField: "user",
        as: "account",
        pipeline: [
          {
            $project: {
              _id: 1,
              balance: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        account: { $first: "$account" },
      },
    },
    {
      $unset: ["password"],
    },
  ]);
  if (!userWithAccount || userWithAccount.length === 0) {
    throw new ApiError("User not found", 404);
  }
  return { user: userWithAccount[0] };
}

async function verifyUsers(userIds: string[]) {
  if (
    !Array.isArray(userIds) ||
    !(Array.isArray(userIds) && userIds.length > 0)
  ) {
    throw new ApiError("No user ids provided", 400);
  }
  if (userIds.length > 5) {
    throw new ApiError("Cannot verify more than 5 users at a time", 400);
  }
  const invalidIds = userIds.filter((id) => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid user ids ${invalidIds}`, 400);
  }
  await connectDB();
  const { modifiedCount } = await User.updateMany(
    { _id: { $in: userIds } },
    { $set: { isVerified: true } },
  );
  return modifiedCount;
}

async function verifyUser(userId: string) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user id", 400);
  }
  await connectDB();
  const verifiedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { isVerified: true } },
    { new: true },
  ).select("-password");
  if (!verifiedUser || !verifiedUser?.isVerified) {
    throw new ApiError("Failed to verify user try after some time", 500);
  }

  console.log("user verification status : ", verifiedUser.isVerified);
  const userAccount = await createAccount(userId);
  if (!userAccount) {
    throw new ApiError("Failed to create user account", 500);
  }
  return { verifiedUser, userAccount };
}

function generatePasswordResetToken() {
  const unHashedToken = randomBytes(64).toString("hex");
  const hashedToken = createHash("sha256").update(unHashedToken).digest("hex");
  return { unHashedToken, hashedToken };
}

async function generatePasswordResetLink(
  userId: string,
  { baseUrl }: { baseUrl?: string } = {},
) {
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user id", 400);
  }
  const { unHashedToken, hashedToken } = generatePasswordResetToken();
  const tokenExpiration = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
  await connectDB();
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiry: tokenExpiration,
      },
    },
    { new: true },
  ).select("-password");
  if (!updatedUser) {
    throw new ApiError("User not found", 404);
  }
  const resetLink = `${baseUrl ?? process.env.FRONTEND_BASE_URL}/reset-password?token=${unHashedToken}&id=${userId}`;
  return { resetLink, tokenExpiration };
}

export {
  getUserById,
  getUserByIdWithAccount,
  getAllUsers,
  verifyUsers,
  verifyUser,
  createUserByAdmin,
  generatePasswordResetLink,
};
