import { ApiResponse } from "@/lib/ApiResponse";
import { deleteMealById } from "@/services/server/meals/delete.meal";
import { getMealById } from "@/services/server/meals/get.meals";
import { updateMeal } from "@/services/server/meals/update.meal";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { updateMealSchema } from "@/zod/meals.schema";

type MealParams = { mealId: string };
export const GET = asyncHandler<MealParams>(async (_req, params)=>{
    const {mealId} =  await params as MealParams;
    if(!mealId){
        throw new ApiError("Meal id not found", 400);
    }
    const meal = await getMealById(mealId);
    return ApiResponse.success("Meal fetched Successfully", {meal})
})
export const PATCH = asyncHandler<MealParams>(async (req, params) => {
  const body = await req.json();
  const { mealId } = (await params) as MealParams;
  console.log("mealId", mealId);
  if (!mealId) {
    throw new ApiError("Meal id not found", 400);
  }
  const parseResult = updateMealSchema.safeParse(body);
  if (!parseResult.success) {
    return ApiResponse.zodError(parseResult.error);
  }
  const mealData = parseResult.data;
  const updatedMeal = await updateMeal(mealId, mealData);
  return ApiResponse.success("Meal updated successfully", { updatedMeal });
});

export const DELETE = asyncHandler<MealParams>(async (_req, params) => {
  const { mealId } = (await params) as MealParams;
  if (!mealId) {
    throw new ApiError("Meal id not found", 400);
  }
  await deleteMealById(mealId);
  return ApiResponse.success("Meal deleted")
});
