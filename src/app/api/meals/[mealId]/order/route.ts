
import { orderMeal } from "@/helpers/server/meals";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth"
import { mealLogSchemaInput } from "@/zod/mealLog.schema";
type MealParams = { mealId: string };
export const POST = withAuth<MealParams>(async(req, context, user)=>{
  const body = await req.json();
  const userId = user?._id;
  const { mealId } = await context.params
  
  if(!userId){
    return ApiResponse.error("User not found", 400);
  }
  if(!mealId){
    return ApiResponse.error("Meal id not found", 400); 
  }
  const parseResult = mealLogSchemaInput.safeParse(body);
  if(!parseResult.success){
    return ApiResponse.zodError(parseResult.error)
  }
  console.log('user from daily meal', user)
  const mealData = parseResult.data;
  const orderedMeal = await orderMeal(mealData, String(userId), mealId);
  return ApiResponse.success("Data", {orderedMeal})
})

