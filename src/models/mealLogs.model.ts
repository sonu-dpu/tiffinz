import { DailyMealFor, MealStatus } from "@/constants/enum";
import mongoose, { AggregatePaginateModel, model, models, Schema } from "mongoose";
import Meal, { IMeal } from "./meal.model";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IMealExtras {
  extras: mongoose.Types.ObjectId;
  quantity: number;
}

interface IMealExtrasWithMeal {
  extras: IMeal;
  quantity: number;
}
interface IMealLog {
  _id?: mongoose.Types.ObjectId;
  date: Date;
  meal: mongoose.Types.ObjectId;
  mealFor: DailyMealFor;
  user: mongoose.Types.ObjectId;
  totalAmount: number;
  status: MealStatus; // Ordered, cancelled, taken, alll in one
  extras?: IMealExtrasWithMeal[];
  description?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MealLogModel extends AggregatePaginateModel<IMealLog> {
  _sample?:string
}
const MealExtrasSchema = new Schema<IMealExtras>({
  extras: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const mealLogSchema = new Schema<IMealLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    meal: {
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

mealLogSchema
  .virtual("priceBreakdown")
  .get(function (this: IMealLog & { meal?: IMeal }) {
    console.log("Calculating price breakdown for meal log");
    const basePrice = this.meal.price || 0;
    const extrasTotal = (this.extras || []).reduce((sum, extra) => {
      const itemPrice = extra.extras.price || 0;
      return sum + itemPrice * extra.quantity;
    }, 0);
    return {
      basePrice,
      extrasTotal,
      totalAmount: this.totalAmount,
    };
  });

mealLogSchema.pre("save", async function (next) {
  console.log("MealLogSchema pre save hook triggered");
  if (this.isModified("extras") || this.isModified("meal") || this.isNew) {
    console.log("Calculating total amount for meal log");
    const meal = await Meal.findById(this.meal);
    const basePrice = meal?.price ?? 0;
    let extrasTotal = 0;
    let extraMealItems = null;
    if (this.extras && this.extras.length > 0) {
      extraMealItems = await Meal.find({
        _id: { $in: this.extras.map((e) => e.extras) },
      });
    }
    this.extras?.forEach((extra) => {
      const item = extraMealItems?.find((m) => m._id.equals(extra.extras));
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
