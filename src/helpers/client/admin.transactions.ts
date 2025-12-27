import { handleError } from "@/lib/handleError";
import axios from "axios";

async function getAllTransactions(options?: { pageParam: number }) {
  try {
    console.log("pageParam", options?.pageParam);
    const resp = await axios.get("/api/admin/transactions", {
      params: {
        page: options?.pageParam,
      },
    });
    if (!resp.data?.success) {
      throw new Error(resp.data?.message);
    }
    return resp.data?.data;
  } catch (error) {
    const errorResp = handleError(error, "Error:: get transactions");
    throw new Error(errorResp.message);
  }
}

async function getTransactionById(transactionId: string) {
  try {
    const resp = await axios.get(`/api/admin/transactions/${transactionId}`);
    const data = resp.data?.data?.transaction;

    return data;
  } catch (error) {
    const message = handleError(error, "get transaction by id").message;
    throw new Error(message);
  }
}

export { getAllTransactions, getTransactionById };
