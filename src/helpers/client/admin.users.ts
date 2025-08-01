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
async function getUsers(): Promise<IUsersResponse<IUser[]>> {
  try {
    const res = await axios.get("/api/admin/users/", {
      headers: { Accept: "application/json" },
    });
    if (res.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    const data = res.data.data.users;
    console.log("data", data);
    return { data: data, error: null };
  } catch (error) {
    // handleError(error, "users");
    return { data: null, error: handleError(error, "users") };
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
): Promise<helperResponse<IUserWithAccount>> {
  try {
    if (!userId.trim()) {
      throw new Error("User id not passed");
    }

    const resp = await axios.get(`/api/admin/users/${userId}?full=true`);
    const data = resp.data?.data?.user;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleError(error, "get user with account") };
  }
}

export { getUsers, verifyUser, getUserWithAccount};
export type { IUsersResponse, IUserWithAccount };
