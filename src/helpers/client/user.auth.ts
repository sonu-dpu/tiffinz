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
      return error;
    }
    const user = await response.json();
    return user;
  } catch (error) {
    return error;
  }
}

export { registerUser };
