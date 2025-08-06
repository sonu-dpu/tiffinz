"use client";

import { handleError } from "@/lib/handleError";
import { IUser } from "@/models/user.model";
import { UserLoginWithPhoneInput } from "@/zod/user.login.schema";
import { RegisterFormInput } from "@/zod/user.schema";
import axios from "axios";

export interface IAuthUser {
  user: IUser | null;
  error: {
    type: string;
    message: string;
  } | null;
}

async function registerUser(userData: RegisterFormInput) {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      console.log("error", error);
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

async function loginUserWithPhone(
  credentials: UserLoginWithPhoneInput
): Promise<IAuthUser> {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    const payload = await response.json();
    const data = payload.data;
    const user = data.user;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: handleError(error, "login") };
  }
}

async function getCurrentUser(): Promise<unknown> {
  try {
    const response = await axios.get("/api/users");
    const user = response.data?.data?.user;

    if (!user) {
      throw new Error("Failed to fetch user");
    }

    return user;
  } catch (error) {
    const message = handleError(error,"get current user").message
    throw new Error(message)
  } // Just return the user object, no error handling here
}

async function logoutUser(): Promise<boolean> {
  try {
    const response = await axios.get("/api/users/logout");
    if (response.status === 200) {
      return true;
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

async function refreshUserSession(): Promise<IAuthUser> {
  try {
    const resp = await axios.get("/api/refresh-tokens");
    console.log("resp", resp);
    const user: IUser = resp.data.data.user;
    if (!user) {
      return { error: resp.data.message, user: null };
    }
    return { user, error: null };
  } catch (error) {
    console.log("error while refreshing token", error);
    return { error: handleError(error, "Session expired"), user: null };
  }
}

export {
  registerUser,
  loginUserWithPhone,
  getCurrentUser,
  logoutUser,
  refreshUserSession,
};
