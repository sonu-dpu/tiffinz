"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { getAllMeals } from "@/helpers/client/meal";
import { IMeal } from "@/models/meal.model";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

function MealsPage() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllMeals"],
    queryFn: getAllMeals,
  });

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  const meals = data?.meals;

  return (
    <div className="flex flex-col gap-2">
      {meals.map((meal: IMeal) => (
        <Card key={String(meal._id)}>
          <CardContent>
            <CardTitle>
              {meal.name} - {meal.type}
            </CardTitle>

            <Badge color={meal.isActive ? "green" : "red"}>
              {meal.isActive ? "Active" : "Inactive"}
            </Badge>

            <p>
              <strong>Price:</strong> ₹{meal.price}
            </p>
            <p>
              <strong>Description:</strong> {meal.description}
            </p>
            <p>
              <small>
                Created at: {new Date(String(meal.createdAt)).toLocaleString()}
              </small>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MealsPage;
