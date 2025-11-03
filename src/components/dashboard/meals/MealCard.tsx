import { IMeal } from "@/models/meal.model";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function MealCard({
  meal,
  listOnly = false,
}: {
  meal: IMeal;
  listOnly?: boolean;
}) {
  return (
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
        {
          !listOnly && <CardFooter className="flex justify-end">
            <Link href={`/dashboard/meals/${meal._id}`}>
          <Button
            disabled={!meal.isActive}
            >
            Order Now
          </Button>
            </Link>
        </CardFooter>
        }
      </CardContent>
    </Card>
  );
}

export default MealCard;
