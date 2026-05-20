"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { getAllMealLogs } from "@/helpers/client/meal";
import { useQuery } from "@tanstack/react-query";
import { formatToIndianCurrency } from "@/lib/utils";
import { getDateAndTimeString } from "@/lib/date-format";

type MealLogListItemType = {
  _id: string;
  mealFor?: number;
  totalAmount?: number;
  date?: string;
  createdAt?: string;
  status?: string;
};

function MealLogsList({ userId }: { userId: string }) {
  const { data, error, isLoading } = useQuery<MealLogListItemType[]>({
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

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="w-full md:max-w-2xl mx-auto bg-transparent shadow-none px-0 mt-4">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-0 border-t">
        {data.map((mealLog) => (
          <MealLogListItem key={String(mealLog._id)} mealLog={mealLog} />
        ))}
      </CardContent>
    </Card>
  );
}

function MealLogListItem({ mealLog }: { mealLog: MealLogListItemType }) {
  const dateValue = mealLog.date ? getDateAndTimeString(mealLog.date) : "-";
  const amountValue = formatToIndianCurrency(mealLog.totalAmount ?? 0);

  return (
    <Link href={`/dashboard/meals/${mealLog._id}`} prefetch={false}>
      <div className="flex justify-between items-center p-4 hover:bg-accent/50 duration-100 border-b cursor-pointer">
        <div className="flex gap-2 flex-col justify-center">
          {mealLog.status ? (
            <Badge className="capitalize" variant={"success"}>
              {mealLog.mealFor}
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-xl">
            {dateValue}
          </span>
        </div>

        <div className="text-right">
          <span className="font-medium text-foreground">{amountValue}</span>
        </div>
      </div>
    </Link>
  );
}

export default MealLogsList;
