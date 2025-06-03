import { PaymentMode, PaymentStatus } from "@/constants/enum";
import mongoose, { model, models, Schema } from "mongoose";

export interface IAddBalanceRequest {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amountAdded: number;
  paymentMode: "CASH" | "ONLINE";
  paymentScreenshot?: string;
  isVerified: boolean;
  status: PaymentStatus;
  verifiedBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updateAt?: Date;
}

const addBalanceRequestSchema = new Schema<IAddBalanceRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountAdded: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum:Object.values(PaymentMode),
      default:PaymentMode.cash,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.pending,
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const AddBalanceRequest =
  models.AddBalanceRequest ||
  model<IAddBalanceRequest>("AddBalanceRequest", addBalanceRequestSchema);

export default AddBalanceRequest;

