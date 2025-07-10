import { MealStatus } from "@/constants/enum";
import mongoose, { Schema, model, models } from "mongoose";

// Define enum for meal status


interface IDailyMeal {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  date: Date;
  status: MealStatus;
  mealLog: mongoose.Types.ObjectId;
  description?: string;
  updatedBy?: string;
  createdAt?: Date;
}

const dailyMealSchema = new Schema<IDailyMeal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MealStatus),
      required: true,
    },
    mealLog: {
      type: Schema.Types.ObjectId,
      ref: "MealLog",
      required: true,
    },
    description: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const DailyMeal = models?.DailyMeal || model<IDailyMeal>("DailyMeal", dailyMealSchema);

export type { IDailyMeal };
export { DailyMeal };
