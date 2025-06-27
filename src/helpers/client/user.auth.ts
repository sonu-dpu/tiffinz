import { handleError } from "@/lib/handleError";
import { UserLoginWithPhoneInput } from "@/zod/user.login.schema";
import { UserInput } from "@/zod/user.schema";
import axios from "axios";

interface IAuthUser {
  user: UserInput | null;
  error: {
    type: string;
    message: string;
  } | null;
}

async function registerUser(userData: UserInput) {
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

async function getCurrentUser(): Promise<IAuthUser> {
  try {
    const response = await axios.get("/api/users");
    if (!response.data) {
      const error = await response.data;
      throw new Error(error.message || "Login failed");
    }
    const user = response.data.data.user;
    console.log('user', user)
    return { user, error: null };
  } catch (error) {
    return { user: null, error: handleError(error, "getUser") };
  }
}
export { registerUser, loginUserWithPhone, getCurrentUser };
