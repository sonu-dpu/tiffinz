
import { UserRole } from "@/constants/enum";
import User, { IUser } from "@/models/user.model";
import connectDB from "@/utils/dbConnect";

export interface GetUserOptions {
  isActive?: boolean;
  isVerified?: boolean;
  role?: UserRole;
}

export async function getAllUsers(options?: GetUserOptions) {
  await connectDB();
  console.log('matcherQuery', options)
  const users: IUser[] = await User.aggregate([
    {
      $match:{...options}
    },
    {
      $unset: ["password"],
    },
  ]);
  return users;
}