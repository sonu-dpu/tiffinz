"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DailyMealFor, MealType } from "@/constants/enum";
import { getAllMeals } from "@/helpers/client/meal";
import axios from "axios";
import { toast } from "sonner";
import LoaderButton from "@/components/ui/loader-button";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronLeft } from "lucide-react";

interface Meal {
  _id: string;
  name: string;
  price: number;
  description?: string;
  type: MealType;
}

const formSchema = z.object({
  mealId: z.string().min(1, "Please select a meal"),
  date: z.string().min(1, "Please select a date"),
  mealFor: z.enum([
    DailyMealFor.breakfast,
    DailyMealFor.lunch,
    DailyMealFor.dinner,
  ]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function OrderMeal({
  className,
  onSuccess,
}: {
  className?: string;
  onSuccess?: () => void;
}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MealType | "ALL">("ALL");
  const [showOrderForm, setShowOrderForm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealId: "",
      date: new Date().toISOString().split("T")[0],
      mealFor: DailyMealFor.lunch,
      description: "",
    },
  });

  const selectedMealId = watch("mealId");
  const selectedMeal = meals.find((m) => String(m._id) === selectedMealId);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoadingMeals(true);
      try {
        const data = await getAllMeals({ isActive: true });
        if (data?.meals) {
          setMeals(data.meals);
        } else if (Array.isArray(data)) {
          setMeals(data);
        }
      } catch (error) {
        toast.error("Failed to fetch meals");
      } finally {
        setLoadingMeals(false);
      }
    };
    fetchMeals();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post(`/api/meals/${data.mealId}/order`, {
        date: data.date,
        mealFor: data.mealFor,
        description: data.description,
      });
      toast.success("Meal ordered successfully!");
      reset({ ...data, description: "" });
      setShowOrderForm(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to order meal");
    }
  };

  const handleMealSelect = (mealId: string) => {
    setValue("mealId", mealId, { shouldValidate: true });
    setShowOrderForm(true);
  };

  const availableCategories = [
    "ALL",
    ...Array.from(new Set(meals.map((m) => m.type))),
  ];
  const filteredMeals = meals.filter(
    (m) => activeCategory === "ALL" || m.type === activeCategory,
  );

  return (
    <Card className={cn("w-full max-w-4xl mx-auto shadow-sm", className)}>
      <CardHeader className="pb-4">
        {showOrderForm && selectedMeal ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -ml-2"
              onClick={() => setShowOrderForm(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-xl font-bold">
                Complete Your Order
              </CardTitle>
              <CardDescription>
                Fill in the timing and details for your selected meal.
              </CardDescription>
            </div>
          </div>
        ) : (
          <div>
            <CardTitle className="text-xl font-bold">Select a Meal</CardTitle>
            <CardDescription>
              Browse through our options to get started.
            </CardDescription>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!showOrderForm ? (
          <div className="space-y-6">
            {/* Category Filter */}
            {meals.length > 0 && !loadingMeals && (
              <div className="flex flex-wrap gap-2 pb-2 border-b">
                {availableCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => setActiveCategory(cat as any)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            {/* Meals Grid */}
            {loadingMeals ? (
              <div className="text-sm text-muted-foreground animate-pulse text-center py-8">
                Loading meals...
              </div>
            ) : meals.length === 0 ? (
              <div className="text-sm text-red-500 text-center py-8">
                No active meals available.
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No meals found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMeals.map((meal) => {
                  const isSelected = selectedMealId === String(meal._id);
                  return (
                    <div
                      key={String(meal._id)}
                      onClick={() => handleMealSelect(String(meal._id))}
                      className={cn(
                        "relative p-4 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col gap-2 hover:shadow-md",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-lg max-w-[85%] leading-tight">
                            {meal.name}
                          </h3>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase font-semibold"
                        >
                          {meal.type}
                        </Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {meal.description || "No description provided"}
                        </p>
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <span className="font-bold text-lg text-foreground">
                          ₹{meal.price}
                        </span>
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "secondary"}
                          className="h-8 rounded-full px-4 text-xs"
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 slide-in-from-right-4 animate-in duration-300"
          >
            {/* Selected Meal Summary Card */}
            {selectedMeal && (
              <div className="p-4 bg-muted/50 rounded-xl border border-border flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{selectedMeal.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMeal.type} • ₹{selectedMeal.price}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOrderForm(false)}
                >
                  Change
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Input
                  type="date"
                  label="Date"
                  className="w-full"
                  {...register("date")}
                  errorMessage={errors.date?.message}
                />
              </div>

              {/* Meal For Selection */}
              <div className="space-y-2">
                <label className="block mb-2 text-sm font-medium text-foreground text-left">
                  Time
                  <Select
                    defaultValue={DailyMealFor.lunch}
                    onValueChange={(value) => setValue("mealFor", value as any)}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full mt-1",
                        errors.mealFor && "border-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DailyMealFor.breakfast}>
                        Breakfast
                      </SelectItem>
                      <SelectItem value={DailyMealFor.lunch}>Lunch</SelectItem>
                      <SelectItem value={DailyMealFor.dinner}>
                        Dinner
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                {errors.mealFor && (
                  <span className="text-red-600 text-sm">
                    {errors.mealFor.message}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <label className="block mb-2 text-sm font-medium text-foreground text-left">
                Notes (Optional)
              </label>
              <Textarea
                {...register("description")}
                placeholder="Any special dietary requests?"
                className="w-full resize-none mt-1"
              />
              {errors.description && (
                <span className="text-red-600 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-3 border-t mt-6 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowOrderForm(false)}
              >
                Back
              </Button>
              <LoaderButton
                fallbackText="Processing..."
                isLoading={isSubmitting}
                className="min-w-[150px]"
              >
                Place Order
              </LoaderButton>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
