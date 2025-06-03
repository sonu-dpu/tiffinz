import connectDB from "@/utils/dbConnect";
import Meal from "@/models/meal.model";
import { ApiError } from "@/utils/apiError";
import { UpdateMealInput } from "@/zod/meals.schema";
import { isValidObjectId } from "mongoose";

export async function updateMeal(id:string, mealData:UpdateMealInput){
    if(!isValidObjectId(id)){
        throw new ApiError("Invalid Meal id", 400);
    }
    await connectDB();
    const updatedMeal = await Meal.findByIdAndUpdate(id, mealData, {new:true});

    if(!updatedMeal){
        throw new ApiError("Meal not found", 404);
    }

    return updatedMeal;
}