import { PaymentStatus, TransactionType, UserRole } from "@/constants/enum";
import { updateAccountBalance } from "@/helpers/server/admin.accounts";
import { verifyBalanceRequest } from "@/helpers/server/admin.add-balance";
import { createTransactionDoc } from "@/helpers/server/transactions";
import Account, { IAccount } from "@/models/account.model";
import { ITransaction } from "@/models/transaction.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { startSession } from "mongoose";

//if in searchParams type===reject reject the reuest
export const PATCH = withAuth<{ id: string }>(
  async (req, context) => {
    const { id: reqId } = await context.params;

    const searchParams = req.nextUrl.searchParams;
    const shouldReject = searchParams.get("reject");
    let response = null;
    const session = await startSession();

    try {
      session.startTransaction();
      if (shouldReject === "true") {
        response = await verifyBalanceRequest(
          reqId,
          PaymentStatus.rejected,
          session,
        );
      } else {
        response = await verifyBalanceRequest(
          reqId,
          PaymentStatus.approved,
          session,
        );
      }
      if (!response) {
        return ApiResponse.error("Failed To verify request");
      }
      //early exit if request is not approved
      if (response.status !== PaymentStatus.approved) {
        return ApiResponse.success("Request rejection success", 200);
      }
      const { user, amountAdded } = response;
      //update account balance
      const { updateType, account } = await updateAccountBalance({
        userId: String(user),
        accountId: undefined,
        amount: amountAdded,
        type: TransactionType.credit,
        session: session,
      });
      const userAccount = await Account.findOneAndUpdate<IAccount>({
        user,
      }).session(session);

      if (!userAccount) {
        throw new ApiError("User Account not found", 404);
      }

      //creating transaction
      const transactionData: ITransaction = {
        amount: amountAdded,
        user,
        isMeal: false,
        type: TransactionType.credit,
        account: userAccount._id,
        openingBalance: userAccount.balance,
      };
      const newTransaction = await createTransactionDoc({
        data: transactionData,
        session,
      });
      await session.commitTransaction();
      return ApiResponse.success("request verified suceessfully", {
        account,
        updateType,
        transaction: newTransaction,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Error while verifying add balance req:", error);
      return ApiResponse.error("Failed to varify the request", 500);
    }
  },
  { requiredRole: UserRole.admin },
);
