import { IMeal } from "@/models/meal.model";
import { IMealExtrasWithMeal, IMealLog } from "@/models/mealLogs.model";
import { IUser } from "@/models/user.model";

export type helperResponse<T=unknown> = {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
};

// meal log with meal details
export type MealLogWithMealDetails = IMealLog & {
  meal:IMeal;
  user:IUser;
  extras?:IMealExtrasWithMeal[]
}