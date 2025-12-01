import { handleError } from "@/lib/handleError";
import { UpdateUserAccountBalanceParams } from "@/zod/account.schema";
import axios from "axios";

export async function addBalanceToUserAccount(data:UpdateUserAccountBalanceParams){
  try {
    const payload = {
      amount:data.amount,
      type:data.type,
      ...(data.accountId && {accountId:data.accountId})
    }
    const response = await axios.patch(`/api/admin/users/${data.userId}/account`, payload);

    return {
      transaction: response.data.data?.transaction,
    }
  } catch (error) {
    console.error("Error adding balance:", error);
    throw new Error(handleError(error, "addBalanceRequest").message);
  }
}

