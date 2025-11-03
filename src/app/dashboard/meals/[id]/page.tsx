"use client";
import MealCard from "@/components/dashboard/meals/MealCard";
import Loader from "@/components/ui/Loader";
import { getMealById } from "@/helpers/client/meal";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

function MealDetailsPage() {
  const { id } = useParams();
  const { data, error, isFetching } = useQuery({
    queryKey: ["getMealById", id],
    queryFn: () => getMealById(id as string),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });
  if (isFetching) {
    return <Loader />;
  } else if (error) {
    return <div>{error.message}</div>;
  }
  console.log("data", data);
  return (
    <div>
      <MealCard meal={data} />
    </div>
  );
}

export default MealDetailsPage;
