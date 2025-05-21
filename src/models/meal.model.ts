import mongoose, { model, models, Schema } from "mongoose";
enum MealType {
  regular = "REGULAR",
  full = "FULL",
  special = "SPL",
}
interface IMeal {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  type: MealType;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const mealSchema = new Schema<IMeal>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(MealType),
      default: MealType.regular,
    },
    price: {
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

const Meal = models?.Meal || model<IMeal>("User", mealSchema);

export type { IMeal };
export default Meal;
