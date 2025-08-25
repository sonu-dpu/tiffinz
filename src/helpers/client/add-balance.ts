import { PaymentStatus } from "@/constants/enum";
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
  IAddBalanceRequestWithUser[]
> {
  try {
    const response = await axios.get("/api/add-balance");
    const requests = response.data?.data?.requests;
    console.log('requests', requests)
    return requests
  } catch (error) {
    throw new Error(handleError(error, "getAllBalanceRequests").message);
  }
}

async function getBalanceRequestDetailsById(
  id: string
): Promise<IAddBalanceRequestWithUser | null> {
  try {
    const response = await axios.get(`/api/admin/add-balance/${id}`);
    const request = response.data?.data?.request;
    if (!request) {
      throw new Error("No request found with the given ID");
    }
    return request;
  } catch (error) {
    console.error("Error fetching balance request details:", error);
    throw new Error(handleError(error, "getBalanceRequestDetailsById").message);
  }
}
async function verifyBalanceRequest(
  id: string,
  action: "approve" | "reject"
): Promise<unknown> {
  try {
    const response = await axios.patch(
      `/api/admin/add-balance/${id}/verify${action === "reject" ? "?reject=true" : ""}`
    );

    if (response.status !== 200) {
      const error = response.data.error || "Failed to verify balance request";
      throw new Error(error);
    }

    return response.data.data; // ✅ return only data
  } catch (error) {

    throw new Error(handleError(error, "").message);
  }
}


type GetRequestsOptions = {
  status?: PaymentStatus;
  count?: boolean;
};

async function getRequests(options: GetRequestsOptions = {}) {
  try {
    const params = new URLSearchParams();

    if (options.status) params.append("status", options.status);
    if (options.count) params.append("count", "true");

    const resp = await axios.get(`/api/admin/add-balance?${params.toString()}`);

    return resp.data?.data;
  } catch (error) {
    throw new Error(handleError(error, "get requests").message);
  }
}


export { addBalanceRequest, getAllBalanceRequests, getBalanceRequestDetailsById, verifyBalanceRequest, getRequests };
