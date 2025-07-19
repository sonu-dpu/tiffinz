import { TransactionType } from "@/constants/enum";
import mongoose, { model, models, Schema } from "mongoose";

interface ITransaction  {
  _id?: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  isMeal: boolean;
  mealLog?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  description?:string;
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      default: TransactionType.debit,
    },
    isMeal: {
      type: Boolean,
      default: true,
    },
    mealLog: {
      type: Schema.Types.ObjectId,
      ref: "MealLogs",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    description:{
      type:String
    }
  },
  { timestamps: true }
);

const Transaction =
  models?.Transaction || model<ITransaction>("Transaction", transactionSchema);

export type { ITransaction };
export default Transaction;
