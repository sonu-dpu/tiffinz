import { DailyMealFor, MealStatus } from "@/constants/enum";
import mongoose, { AggregatePaginateModel, model, models, Schema } from "mongoose";
import Meal from "./meal.model";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IMealExtras {
  extrasId: mongoose.Types.ObjectId;
  quantity: number;
}

interface IMealLog {
  _id?: mongoose.Types.ObjectId;
  date: Date;
  mealId: mongoose.Types.ObjectId;
  mealFor: DailyMealFor;
  userId: mongoose.Types.ObjectId;
  totalAmount: number;
  status: MealStatus; // Ordered, cancelled, taken, alll in one
  extras?: IMealExtras[];
  description?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MealLogModel extends AggregatePaginateModel<IMealLog> {
  _sample?:string
}
const MealExtrasSchema = new Schema<IMealExtras>({
  extrasId: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const mealLogSchema = new Schema<IMealLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MealStatus),
      default: MealStatus.not_taken,
    },
    mealFor: {
      type: String,
      enum: Object.values(DailyMealFor),
    },
    extras: { type: [MealExtrasSchema], default: [] },
    totalAmount: { type: Number, required: true },
    description: {
      type: String,
      maxlength: [100, "Description should be less than 100 chars"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// mealLogSchema
//   .virtual("priceBreakdown")
//   .get(function (this: IMealLog & { mealId?: IMeal }) {
//     console.log("Calculating price breakdown for meal log");
//     const basePrice = this.mealId?.price || 0;
//     const extrasTotal = (this.extras || []).reduce((sum, extra) => {
//       const itemPrice = extra.extrasId?.price || 0;
//       return sum + itemPrice * extra.quantity;
//     }, 0);
//     return {
//       basePrice,
//       extrasTotal,
//       totalAmount: this.totalAmount,
//     };
//   });

mealLogSchema.pre("save", async function (next) {
  console.log("MealLogSchema pre save hook triggered");
  if (this.isModified("extras") || this.isModified("mealId") || this.isNew) {
    console.log("Calculating total amount for meal log");
    const meal = await Meal.findById(this.mealId);
    const basePrice = meal?.price ?? 0;
    let extrasTotal = 0;
    let extraMealItems = null;
    if (this.extras && this.extras.length > 0) {
      extraMealItems = await Meal.find({
        _id: { $in: this.extras.map((e) => e.extrasId) },
      });
    }
    this.extras?.forEach((extra) => {
      const item = extraMealItems?.find((m) => m._id.equals(extra.extrasId));
      if (item) {
        extrasTotal += item.price * extra.quantity;
      }
    });
    this.totalAmount = basePrice + extrasTotal;
  }

  next();
});


mealLogSchema.plugin(mongooseAggregatePaginate)
const MealLog = (models?.MealLog as MealLogModel ) || model<IMealLog>("MealLog", mealLogSchema);
export type { IMealLog, IMealExtras, MealLogModel };
export default MealLog;
