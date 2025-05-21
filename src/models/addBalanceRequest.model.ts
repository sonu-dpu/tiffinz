import mongoose, { model, models, Schema } from "mongoose";
enum paymentStatus {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
}
interface IAddBalanceRequest {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amountAdded: number;
  paymentMode: "CASH" | "ONLINE";
  paymentScreenshot?: string;
  isVerified: boolean;
  status: paymentStatus;
  verifiedBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updateAt?: Date;
}

const addBalanceRequestSchema = new Schema<IAddBalanceRequest>(
  {
    amountAdded: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(paymentStatus),
      default: paymentStatus.pending,
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Adjust as needed
    },
  },
  { timestamps: true }
);

const AddBalanceRequest =
  models.AddBalanceRequest ||
  model<IAddBalanceRequest>("AddBalanceRequest", addBalanceRequestSchema);

export default AddBalanceRequest;
