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

interface IUserWithAccount extends IUser {
  account: IAccount | null;
}
async function getUsers(): Promise<IUser[]> {
  try {
    const res = await axios.get("/api/admin/users/", {
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
    throw handleError(error, "users"); // Let React Query handle the error
  }
}


async function verifyUser(userId: string): Promise<helperResponse> {
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
