import { UserLoginWithPhoneInput } from "@/zod/user.login.schema";
import { UserInput } from "@/zod/user.schema";

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
async function loginUserWithPhone(credentials: UserLoginWithPhoneInput) {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    return error;
  }
}
export { registerUser, loginUserWithPhone };
