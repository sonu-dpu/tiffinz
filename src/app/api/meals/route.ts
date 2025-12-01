import { ApiResponse } from "@/utils/ApiResponse";
import {
  getAllMeals,
  GetAllMealsOptions,
} from "@/helpers/server/meals";
import { withAuth } from "@/utils/withAuth";
import { MealType, UserRole } from "@/constants/enum";

export const GET = withAuth(async (req) => {
    const searchParams = req.nextUrl.searchParams;
    const options: GetAllMealsOptions = {
      isActive: searchParams.get("isActive") === "true",
      mealType: searchParams.get("type") as MealType || "",
      searchQuery: searchParams.get("q") || "",
    };
    const meals = await getAllMeals(options);
    return ApiResponse.success("Meals fetched successfully", { meals });
  },
  { requiredRole: UserRole.user }
);



