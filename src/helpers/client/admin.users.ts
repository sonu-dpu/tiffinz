import axios from "axios";
import { IUser } from "@/models/user.model";
import { handleError } from "@/lib/handleError";
import { helperResponse } from "./client.types";
import { IAccount } from "@/models/account.model";
interface IUsersResponse<T> {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
}
export type GetUsersOptions = {
  user?:string,
  count?:boolean,
  isVerified?:boolean,
  query?:string,
}
interface IUserWithAccount extends IUser {
  account: IAccount | null;
}
async function getUsers(options:GetUsersOptions) {

  try {
    const params = new URLSearchParams();
    if(options.count) params.append("count", "true");
    if(options.isVerified!=null) params.append("verified", options.isVerified?"true":"false")
    if(options.query?.trim()) params.append("query", options.query.trim())
    const res = await axios.get(`/api/admin/users?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });

    if (res.status !== 200) {
      throw new Error("Failed to fetch users");
    }

    const users = res.data?.data?.users;

    if (!users) {
      throw new Error("No users found in response");
    }

    return users;
  } catch (error) {
    throw handleError(error, "users").message;
  }
}


async function verifyUser(userId: string): Promise<helperResponse<IUser>> {
  try {
    const resp = await axios.patch(`/api/admin/users/${userId}/verify`);
    const { user } = resp.data.data;
    return { data: user, error: null };
  } catch (error) {
    return { data: null, error: handleError(error, "verify user") };
  }
}

async function getUserWithAccount(
  userId: string
): Promise<IUserWithAccount> {
  try {
    if (!userId.trim()) {
      throw new Error("User id not passed");
    }
    const resp = await axios.get(`/api/admin/users/${userId}?full=true`);
    const data = resp.data?.data?.user;
    return data
  } catch (error) {
    console.log('error', error)
    throw new  Error(handleError(error, "get user with account").message)
  }
}

export { getUsers, verifyUser, getUserWithAccount};
export type { IUsersResponse, IUserWithAccount };
