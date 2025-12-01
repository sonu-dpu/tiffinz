"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import LoaderButton from "@/components/ui/loader-button"; // your custom button
import { MealInput, mealSchema } from "@/zod/meals.schema";
import { MealType } from "@/constants/enum";
import { addNewMeal } from "@/helpers/client/admin.meals";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddMealForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mealSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: MealInput) => {
    try {
      await addNewMeal(data);
      toast.success("New Meal created successfully");
      reset();
      router.push("/dashboard/meals");
    } catch (error) {
      toast.error("Failed to create meal");
      setError("root", { message: "Error while creating meal" });
      console.error("Error while creating meal", error);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Add Meal</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Meal Name */}
          <div className="space-y-2">
            <Input
              {...register("name")}
              label="Meal Name"
              placeholder="Enter meal name"
              className="w-full"
              errorMessage={errors.name?.message}
            />
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <label className="block mb-2 text-sm font-medium text-foreground text-left">
              Meal Type
              <Select
                onValueChange={(value) => setValue("type", value as MealType)}
                defaultValue={MealType.regular}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(MealType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            {errors.type && (
              <span className="text-red-600 text-sm">
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Enter price"
              className="w-full"
              {...register("price", {
                setValueAs: (v) => Number(v),
              })}
              errorMessage={errors.price?.message}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Textarea
              {...register("description")}
              placeholder="Short description..."
              className="w-full"
            />
            {errors.description && (
              <span className="text-red-600 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Submit Loader Button */}
          <LoaderButton
            fallbackText="Saving..."
            isLoading={isSubmitting}
            className="min-w-[150px]"
          >
            Add Meal
          </LoaderButton>
        </form>

        {/* Root level errors */}
        {errors.root && (
          <div className="mt-4 text-red-600 text-sm">
            {errors.root.message || "Something went wrong."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
