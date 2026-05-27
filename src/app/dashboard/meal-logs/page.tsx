"use client";
import {
  MealLogListItem,
  MealLogListItemType,
} from "@/components/dashboard/meals/MealLogsList";
import { getAllMealLogs } from "@/helpers/client/meal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

import Loader from "@/components/ui/Loader";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getMonthFromDate } from "@/lib/date-format";
import React from "react";

function MealLogs() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const { data, error, isFetching, fetchNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ["getUserMealLogs", "page", user],
      queryFn: ({ pageParam }) =>
        getAllMealLogs({
          userId: user as string,
          page: pageParam,
          limit: 10,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNextPage) {
          return lastPage.page + 1;
        }
        return null;
      },
      getPreviousPageParam: (lastPage) => lastPage.hasPrevPage,
    });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: null,
        threshold: 0.1,
      },
    );
    const element = loaderRef.current;
    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [data, fetchNextPage]);
  let currentMonth = "";
  if (status === "pending") {
    return <Loader />;
  }

  if (status === "error") {
    toast.error("Unable to load meal logs." + error.message, {
      description: "Please try again later.",
    });
    return (
      <div className="text-sm text-destructive px-4 py-3">
        Unable to load meal logs.
      </div>
    );
  }
  console.log("data", data);
  if (!data || data.pages[0].docs.length === 0) {
    return null;
  }

  return (
    <Card className="w-full md:max-w-2xl mx-auto bg-transparent shadow-none px-0 border-none">
      <CardContent className="p-0 mt-0 ">
        {data.pages.map((group) =>
          group.docs.map((mealLog: MealLogListItemType) => {
            const month = getMonthFromDate(new Date(mealLog.date ?? "")) || "";
            if (currentMonth !== month) {
              currentMonth = month;
              return (
                <React.Fragment key={String(mealLog._id)}>
                  <div className="text-left bg-accent py-2 px-4 mx-2 mt-6 rounded-xl font-semibold text-shadow-muted-foreground text-xl">
                    {currentMonth}
                  </div>
                  <MealLogListItem
                    mealLog={mealLog}
                    key={String(mealLog._id)}
                  />
                </React.Fragment>
              );
            }
            return (
              <MealLogListItem key={String(mealLog._id)} mealLog={mealLog} />
            );
          }),
        )}
        <div
          ref={loaderRef}
          className="mx-auto mt-4 p-4 flex justify-center text-muted-foreground"
        >
          {isFetching ? <Loader /> : hasNextPage ? "" : "No more meal logs"}
        </div>
      </CardContent>
    </Card>
  );
}

export default MealLogs;
