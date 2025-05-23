import { ApiResponse } from "@/lib/ApiResponse";
import connectDB from "@/lib/dbConnect";
import Meal from "@/models/meal.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { MealInput, mealSchema } from "@/zod/meals.schema";

export const POST = asyncHandler(async(req)=>{
    const body = await req.json();
    const parseResult = mealSchema.safeParse(body);
    if(!parseResult.success){
        return ApiResponse.zodError(parseResult.error);
    }
    const mealData:MealInput =  parseResult.data;
    await connectDB()
    const meal = await Meal.create(mealData);
    if(!meal){
        return ApiResponse.error("Failed to create meal", 500)
    }
    return ApiResponse.success("Meal added successfully", meal)
})