import Transaction, { ITransaction } from "@/models/transaction.model";
import { ApiError } from "@/utils/apiError";
import connectDB from "@/utils/dbConnect";
import { isValidObjectId } from "mongoose";
async function createTransaction(transactionDoc:ITransaction) {
    if(!isValidObjectId(transactionDoc.account)){
        throw new ApiError("Inavlid Account id");
    }
    if(!isValidObjectId(transactionDoc.user)){
        throw new ApiError("Inavlid user id");
    } 
    await connectDB();
    const newTransaction = await Transaction.create(transactionDoc);

    if(!newTransaction){
        throw new ApiError("Failed to create a transaction");
    }
    return newTransaction
}



export {createTransaction}