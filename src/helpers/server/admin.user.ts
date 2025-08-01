import { UserRole } from "@/constants/enum";
import User, { IUser } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import mongoose ,{ isValidObjectId} from "mongoose";
import { createAccount } from "./admin.accounts";

export interface GetUserOptions {
  isActive?: boolean;
  isVerified?: boolean;
  role?: UserRole;
}

async function getAllUsers(options?: GetUserOptions) {
  await connectDB();
  console.log("matcherQuery", options);
  const users: IUser[] = await User.aggregate([
    {
      $match: { ...options },
    },
    {
      $unset: ["password"],
    },
  ]);
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

async function getUserByIdWithAccount(userId:string) {
  if(!isValidObjectId(userId)){
    throw new ApiError("Invalid user id", 400);
  }
  await connectDB();
  const userWithAccount = await User.aggregate([
    {
      $match:{
        _id : new mongoose.Types.ObjectId(userId)
      },
    },{
      $lookup:{
        from:"accounts",
        localField:"_id",
        foreignField:"user",
        as:"account",
        pipeline:[
          {
            $project:{
              _id:1,
              balance:1,
              createdAt:1,
              updatedAt:1,
            }
          }
        ]
      }
    },
    {
      $addFields:{
        account:{$first:"$account"}
      }
    },
    {
      $unset:["password"]
    }
  ]);

  return {user: userWithAccount[0]}
}

async function verifyUsers(userIds: string[]) {
  if(!Array.isArray(userIds) || !(Array.isArray(userIds) && userIds.length>0)){
    throw new ApiError("No user ids provided", 400)
  }
  if(userIds.length>5){
    throw new ApiError("Cannot verify more than 5 users at a time", 400)
  }
  const invalidIds = userIds.filter((id)=>!isValidObjectId(id));
  if(invalidIds.length>0){
    throw new ApiError(`Invalid user ids ${invalidIds}`, 400)
  }
  await connectDB()
  const {modifiedCount} = await User.updateMany(
    {_id: {$in: userIds}},
    {$set:{isVerified: true}}
  )
  return modifiedCount;
}


async function verifyUser(userId: string) {
  if(!isValidObjectId(userId)){
    throw new ApiError("Invalid user id", 400)
  }
  await connectDB()
  const verifiedUser = await User.findByIdAndUpdate(userId, 
    {$set:{isVerified:true}},
    {new:true}
  ).select("-password");
  if(!verifiedUser || !verifiedUser?.isVerified){
    throw new ApiError("Failed to verify user try after some time", 500)
  }
  
  console.log("user verification status : ", verifiedUser.isVerified);
  const userAccount = await createAccount(userId);
  if(!userAccount){
    throw new ApiError("Failed to create user account", 500)
  }
  return {verifiedUser, userAccount}
}
export { getUserById, getUserByIdWithAccount, getAllUsers, verifyUsers, verifyUser};
