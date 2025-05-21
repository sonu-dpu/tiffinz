import { TransactionType } from "@/constants/enum";
import mongoose, { model, models, Schema } from "mongoose";


interface ITransaction{
    _id?:mongoose.Types.ObjectId;
    amount:number;
    type: TransactionType;
    isMeal:boolean;
    mealId?:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    accountId:mongoose.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}


const transactionSchema = new Schema<ITransaction>({
    amount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum: Object.values(TransactionType),
        default:TransactionType.debit,
    },
    isMeal:{
        type:Boolean,
        default:true,
    },
    mealId:{
         type:Schema.Types.ObjectId,
        ref:"Meal"
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    accountId:{
        type:Schema.Types.ObjectId,
        ref:"Account"
    }

},
     { timestamps: true }
);


const Transaction= models?.Transaction || model<ITransaction>("Transaction", transactionSchema);

export type { ITransaction };
export default Transaction;