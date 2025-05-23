import mongoose, { model, models, Schema } from "mongoose";

interface IMealExtras {
  item: string;
  quantity: number;
  price: number;
}

interface IMealLog {
  _id?: mongoose.Types.ObjectId;
  mealId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  totalAmount: number;
  extras?: IMealExtras[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MealExtrasSchema = new Schema<IMealExtras>({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const MealLogSchema = new Schema<IMealLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    extras: {
      type: [MealExtrasSchema],
      required: false,
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxlength: [100, "Description should be less than 100 chars"],
    },
  },
  { timestamps: true }
);

const MealLog = models?.MealLog || model<IMealLog>("MealLog", MealLogSchema);

export type { IMealLog, IMealExtras };
export default MealLog;