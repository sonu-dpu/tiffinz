import axios from "axios";
import { handleError } from "@/lib/handleError";

async function getCurrentUserAccount(): Promise<unknown> {
  try {
    const resp = await axios.get("/api/accounts");
    const data = resp.data?.data?.account;
    return data;
  } catch (error) {
    throw handleError(error, "get current user account");
  }
}
export { getCurrentUserAccount };

// try {
//     const response = await axios.get("/api/users");
//     const user = response.data?.data?.user;

//     if (!user) {
//       throw new Error("Failed to fetch user");
//     }

//     return user;
//   } catch (error) {
//     const message = handleError(error,"get current user").message
//     throw new Error(message)
//   } //
