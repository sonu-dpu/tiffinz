"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { getAllMealLogs } from "@/helpers/client/meal";
import { useQuery } from "@tanstack/react-query";
import { formatToIndianCurrency } from "@/lib/utils";
import { getSmartDate } from "@/lib/date-format";
import { Button } from "@/components/ui/button";
import { PaginatedResult } from "@/helpers/client/client.types";

export type MealLogListItemType = {
  _id: string;
  mealFor?: number;
  totalAmount?: number;
  date?: string;
  createdAt?: string;
  status?: string;
};

function MealLogsList({ userId }: { userId: string }) {
  const { data, error, isLoading } = useQuery<
    PaginatedResult<MealLogListItemType>
  >({
    queryKey: ["getUserMealLogs", userId],
    queryFn: () => getAllMealLogs({ userId }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-sm text-destructive px-4 py-3">
        Unable to load meal logs.
      </div>
    );
  }
  const logs = data?.docs || [];
  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <Card className="w-full md:max-w-2xl mx-auto bg-transparent shadow-none px-0 mt-4">
      <CardHeader>
        <CardTitle>Recent Tiffins</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-0 border-t">
        {logs.map((mealLog) => (
          <MealLogListItem key={String(mealLog._id)} mealLog={mealLog} />
        ))}
      </CardContent>
      <div className="p-4 text-center">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/meal-logs?user=${userId}`} prefetch={false}>
            View All
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export function MealLogListItem({ mealLog }: { mealLog: MealLogListItemType }) {
  const dateValue = mealLog.date ? getSmartDate(mealLog.date) : "-";
  const amountValue = formatToIndianCurrency(mealLog.totalAmount ?? 0);
  // const loggedAtValue = getSmartDate(mealLog.createdAt ?? "");

  return (
    <Link href={`/dashboard/meals/${mealLog._id}`} prefetch={false}>
      <div className="flex justify-between items-center p-4 hover:bg-accent/50 duration-100 border-b cursor-pointer">
        <div className="flex gap-2 flex-col justify-center">
          {mealLog.status ? (
            <Badge variant={"default"} className=" ">
              {mealLog.mealFor}
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-xl">
            {dateValue}
          </span>
        </div>

        <div className="text-right">
          <span className="font-medium text-pretty">{amountValue}</span>
          {/* <p className="text-xs text-muted-foreground">
            Logged: {loggedAtValue}
          </p> */}
        </div>
      </div>
    </Link>
  );
}

export default MealLogsList;
