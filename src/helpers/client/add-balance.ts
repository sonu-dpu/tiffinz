import { handleError } from "@/lib/handleError";
import { IAddBalanceRequest } from "@/models/addBalanceRequest.model";
import { AddBalanceRequestInput } from "@/zod/addBalanceRequest.schema";
import axios from "axios";

interface IAddBalanceResponse<T> {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
}
async function addBalanceRequest(
  data: AddBalanceRequestInput
): Promise<IAddBalanceResponse<IAddBalanceRequest>> {
  try {
    const response = await axios.post("/api/add-balance", data);
    if (response.status !== 200) {
      const error = response.data.error || "Failed to add balance request";
      console.error("Error adding balance:", error);
      throw new Error(error);
    }

    return {
      data: response.data.data, 
      error: null,}
  } catch (error) {
    console.error("Error adding balance:", error);
    return {data: null, error:handleError(error, "addBalanceRequest")};
  }
}

export { addBalanceRequest };
