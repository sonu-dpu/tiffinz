import { PaymentMode, PaymentStatus } from "@/constants/enum";
import mongoose, { model, models, Schema } from "mongoose";

export interface IAddBalanceRequest {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amountAdded: number;
  paymentMode: PaymentMode;
  paymentScreenshot?: string;
  status: PaymentStatus;
  verifiedBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updateAt?: Date;
}

const addBalanceRequestSchema = new Schema<IAddBalanceRequest>(
  {
    user: {
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
    paymentScreenshot: {
      type: String,
      required: false,
      default: null,
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

