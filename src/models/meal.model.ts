import { MealType } from "@/constants/enum";
import mongoose, { model, models, Schema } from "mongoose";

interface IMeal {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  type: MealType;
  isActive:boolean;
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
    isActive:{
      type:Boolean,
      default:false,
    },
    description: {
      type: String,
      maxlength: [100, "Description should be less than 100 chars"],
    },
  },
  { timestamps: true }
);

const Meal = models?.Meal || model<IMeal>("Meal", mealSchema);

export type { IMeal };
export default Meal;
