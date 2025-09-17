import { TransactionType } from "@/constants/enum";
import mongoose, { AggregatePaginateModel, model, models, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
interface TransactionModel extends AggregatePaginateModel<ITransaction> {
  _sample?:string
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
transactionSchema.plugin(mongooseAggregatePaginate)
const Transaction =
  models?.Transaction as TransactionModel|| model<ITransaction>("Transaction", transactionSchema);

export type { ITransaction };
export default Transaction;
