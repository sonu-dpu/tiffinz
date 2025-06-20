import { DailyMealFor } from "@/constants/enum";
import { z } from "zod/v4";

const mealLogSchemaInput = z.object({
  date: z.preprocess((arg)=> typeof arg === "string"? new Date(arg) : arg, z.date()),
  mealFor: z.enum(DailyMealFor),
  extras: z
    .array(
      z.object({
        extrasId: z.string(),
        quantity: z.number().min(1),
      })
    )
    .optional(),
  description: z.string().optional(),
});

export type MealLogSchemaInputType = z.infer<typeof mealLogSchemaInput>;
export { mealLogSchemaInput };
