import { PaymentStatus, UserRole } from "@/constants/enum";
import {
  updateAccountBalance,
  verifyBalanceRequest,
} from "@/helpers/server/admin.add-balance";
import { createTransaction } from "@/helpers/server/transactions";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

//if in searchParams type===reject reject the reuest
export const PATCH = withAuth<{ id: string }>(
  async (req, context) => {
    const { id:reqId } = await context.params;

    const searchParams = req.nextUrl.searchParams;
    const shouldReject = searchParams.get("reject");
    let response = null;
    if (shouldReject === "true") {
      response = await verifyBalanceRequest(reqId, PaymentStatus.rejected);
    } else {
      response = await verifyBalanceRequest(reqId, PaymentStatus.approved);
    }
    if (!response) {
      return ApiResponse.error("Failed To verify request");
    }
    //early exit if request is not approved
    if (response.status !== PaymentStatus.approved) {
      return ApiResponse.success("Request rejection success", 200);
    }
    //update account balance
    const { updateType, account } = await updateAccountBalance(
      String(response.user),
      response.amountAdded
    );
    //creating transaction
    const newTransaction = await createTransaction({
      user: account.user,
      account: account._id,
      amount: response.amountAdded,
      type: updateType,
      isMeal: false,
    });
    return ApiResponse.success("request verified suceessfully", {
      account,
      updateType,
      transaction: newTransaction,
    });
  },
  { requiredRole: UserRole.admin }
);

