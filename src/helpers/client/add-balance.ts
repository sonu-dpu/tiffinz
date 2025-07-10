import { handleError } from "@/lib/handleError";
import { IAddBalanceRequest } from "@/models/addBalanceRequest.model";
import { IUser } from "@/models/user.model";
import { AddBalanceRequestInput } from "@/zod/addBalanceRequest.schema";
import axios from "axios";

export interface IAddBalanceRequestWithUser extends Omit<IAddBalanceRequest, "user">{
  user:IUser
}

interface IAddBalanceResponse<T> {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
}

async function addBalanceRequest(
  data: AddBalanceRequestInput
): Promise<IAddBalanceResponse<IAddBalanceRequestWithUser>> {
  try {
    const response = await axios.post("/api/add-balance", data);
    if (response.status !== 200) {
      const error = response.data.error || "Failed to add balance request";
      console.error("Error adding balance:", error);
      throw new Error(error);
    }

    return {
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    console.error("Error adding balance:", error);
    return { data: null, error: handleError(error, "addBalanceRequest") };
  }
}

async function getAllBalanceRequests(): Promise<
  IAddBalanceResponse<IAddBalanceRequestWithUser[]>
> {
  try {
    const response = await axios.get("/api/add-balance");
    const requests = response.data.data.requests;
    console.log('requests', requests)
    return {data: requests, error: null}
  } catch (error) {
    return {data:null, error: handleError(error, "Get Requests")}
  }
}
export { addBalanceRequest, getAllBalanceRequests };
