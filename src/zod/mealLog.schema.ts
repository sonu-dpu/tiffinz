import { DailyMealFor } from "@/constants/enum";
import { z } from "zod/v4";
const extrasItemSchema = z.object({
  extras: z.string(),
  quantity: z.number().min(1).max(10),
});
const mealLogSchemaInput = z.object({
  date: z.preprocess((arg)=> typeof arg === "string"? new Date(arg) : arg, z.date()),
  mealFor: z.enum(DailyMealFor),
  extras: z
    .array(extrasItemSchema)
    .optional(),
  description: z.string().optional(),
});

const mealLogSchemaForAdminClient = mealLogSchemaInput.extend({
  user: z.string(),
  meal: z.string().min(24,"Invalid meal id").max(24, "Invalid meal id"),
}).omit({
  date:true
})
type MealLogSchemaInputType = z.infer<typeof mealLogSchemaInput>;
type mealLogSchemaForAdminClientType = z.infer<typeof mealLogSchemaForAdminClient>;
type ExtrasItemSchemaType = z.infer<typeof extrasItemSchema>;

export type {MealLogSchemaInputType, mealLogSchemaForAdminClientType, ExtrasItemSchemaType};
export { mealLogSchemaInput, mealLogSchemaForAdminClient, extrasItemSchema};
