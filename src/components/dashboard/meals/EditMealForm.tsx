"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import LoaderButton from "@/components/ui/loader-button";
import { MealInput, mealSchema } from "@/zod/meals.schema";
import { MealType } from "@/constants/enum";
import { updateMealById } from "@/helpers/client/admin.meals";
import { toast } from "sonner";
import { IMeal } from "@/models/meal.model";
import { QueryClientContext } from "@tanstack/react-query";
import { useContext } from "react";

export default function EditMealForm({
  meal,
  onSuccess,
}: {
  meal: IMeal;
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mealSchema),
    values: {
      name: meal.name,
      description: meal.description,
      price: meal.price,
      type: meal.type as MealType,
    },
  });

  const client = useContext(QueryClientContext);

  const onSubmit = async (data: MealInput) => {
    try {
      await updateMealById(String(meal._id), data);
      toast.success("Meal updated successfully");
      client?.invalidateQueries({
        queryKey: ["getAllMeals"],
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to update meal");
      setError("root", { message: "Error while updating meal" });
      console.error("Error while updating meal", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
            defaultValue={meal.type as MealType}
          >
            <SelectTrigger className="w-full mt-1">
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
          <span className="text-red-600 text-sm">{errors.type.message}</span>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Input
          type="number"
          label="Price"
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
        <label className="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
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
      <div className="pt-2 flex justify-end">
        <LoaderButton
          fallbackText="Saving..."
          isLoading={isSubmitting}
          className="min-w-[120px]"
        >
          Save Changes
        </LoaderButton>
      </div>

      {/* Root level errors */}
      {errors.root && (
        <div className="mt-4 text-red-600 text-sm">
          {errors.root.message || "Something went wrong."}
        </div>
      )}
    </form>
  );
}
