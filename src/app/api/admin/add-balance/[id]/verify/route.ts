import { TransactionType, UserRole } from "@/constants/enum";
import { updateAccountBalance, verifyBalanceRequest } from "@/helpers/server/admin.add-balance";
import { createTransaction } from "@/helpers/server/transactions";
import { IAddBalanceRequest } from "@/models/addBalanceRequest.model";
import { ITransaction } from "@/models/transaction.model";
import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/utils/dbConnect";
import { withAuth } from "@/utils/withAuth";


export const PATCH = withAuth<{reqId:string}>(async (_req, context) => {
    const {reqId} = await context.params;
    const response = await verifyBalanceRequest(reqId);
    if(!response){
        return ApiResponse.error("Failed To verify request")
    }

    
    return ApiResponse.success("request verified suceessfully")

}, { requiredRole: UserRole.admin });





//TODO; implement full functionality

async function addBalanceAndCreateTransaction(reqDoc: IAddBalanceRequest){
    await connectDB();
    const transactionDoc:ITransaction = {
        amount: reqDoc.amountAdded,
        isMeal: false,
        type: TransactionType.credit,
        user:reqDoc.user._id,

    }
    const createAndAdd =  [createTransaction(transactionDoc), updateAccountBalance(String(reqDoc.user), reqDoc.amountAdded)]
    const response = await Promise.all(createAndAdd);

}