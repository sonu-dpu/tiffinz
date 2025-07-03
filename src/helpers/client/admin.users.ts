import axios from "axios";
import { IUser } from "@/models/user.model";
import { handleError } from "@/lib/handleError";
interface IUsersResponse<T> {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
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
    handleError(error, "users");
    return { data: null, error: handleError(error, "users") };
  }
}

export { getUsers };
export type { IUsersResponse };
