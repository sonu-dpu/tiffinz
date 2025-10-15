import { handleError } from "@/lib/handleError";
import axios from "axios";

async function getAllTransactions() {
  try {
    const resp = await axios.get("/api/admin/transactions");
    if(!resp.data?.success){
      throw new Error(resp.data?.message)
    }
    return resp.data?.data
  } catch (error) {
      const errorResp = handleError(error, "Error:: get transactions");
      throw new Error(errorResp.message)
  }
}



export {getAllTransactions}