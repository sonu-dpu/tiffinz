import mongoose, { Schema, model, models } from "mongoose";

// Define enum for meal status
export enum MealStatus {
  ORDERED = "ordered",
  CANCELLED = "cancelled",
  NOT_REQUIRED = "not_required",
}

interface IDailyMeal {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  status: MealStatus;
  mealId: mongoose.Types.ObjectId;
  description?: string;
  updatedBy?: string;
  createdAt?: Date;
}

const dailyMealSchema = new Schema<IDailyMeal>(
  {
    userId: {
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
    mealId: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
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
