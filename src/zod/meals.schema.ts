import { MealType } from "@/constants/enum";

import { z } from "zod/v4";

const mealSchema = z.object({
  name: z.string().trim().min(3, "Meal name must be at least 3 characters"),
  type: z.enum(MealType).default(MealType.regular),
  price: z.number("Price must be a valid number"),
  description: z.string().trim().max(100, "Description is too long").optional(),
});

const updateMealSchema = mealSchema.partial()

type MealInput = z.infer<typeof mealSchema>;
type UpdateMealInput = z.infer<typeof updateMealSchema>;


export type { MealInput, UpdateMealInput };
export {mealSchema, updateMealSchema}
