"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Loader2, Calendar, Clock, ShoppingBag } from "lucide-react";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getMealOrders } from "@/helpers/client/admin.meals";
import { DailyMealFor, MealStatus } from "@/constants/enum";
import { Button } from "@/components/ui/button";

export default function MyOrdersPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const mealFor = searchParams.get("mealFor") || "";
  const { data, isLoading } = useQuery({
    queryKey: ["getMealOrders", status, mealFor],
    queryFn: () =>
      getMealOrders({
        date: new Date().toISOString(),
        status: status as MealStatus,
        mealFor: mealFor as DailyMealFor,
      }),
  });

  const handlemealFor = (e) => {
    const mealFor = e.target.textContent.trim().toUpperCase();
    const validMealFor = Object.values(DailyMealFor).includes(
      mealFor as DailyMealFor,
    )
      ? mealFor
      : "";
    const params = new URLSearchParams(window.location.search);
    if (validMealFor) {
      params.set("mealFor", validMealFor);
    } else {
      params.delete("mealFor");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };
  const orders = data?.docs || [];
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and track all your past and upcoming meal orders.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">isLoading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <CardTitle className="text-xl">No Orders Found</CardTitle>
          <p className="text-muted-foreground mt-2">
            You havent placed any meal orders yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-x-2">
            <Button className="mb-4 px-3 py-1 text-sm" onClick={handlemealFor}>
              All
            </Button>
            <Button
              onClick={handlemealFor}
              variant={"secondary"}
              className="mb-4 px-3 py-1 text-sm"
            >
              Breakfast
            </Button>
            <Button variant={"secondary"} className="mb-4 px-3 py-1 text-sm">
              Lunch
            </Button>
            <Button variant={"secondary"} className="mb-4 px-3 py-1 text-sm">
              Dinner
            </Button>
          </div>
          <div>
            {orders.map((order) => (
              <Card
                key={String(order._id)}
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className=" pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">
                        {order.meal?.name || "Meal item"}
                      </CardTitle>
                      <CardDescription className="uppercase mt-1 font-semibold">
                        {order.meal?.type}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-2.5 py-0.5 rounded-full uppercase text-[10px] font-bold order.statu)}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center text-sm text-foreground/80">
                    <Calendar className="w-4 h-4 mr-3 text-primary" />
                    <span>
                      <strong className="font-semibold block text-xs text-muted-foreground uppercase">
                        Scheduled For
                      </strong>
                      {getDateAndTimeString(order.date)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-foreground/80">
                    <Clock className="w-4 h-4 mr-3 text-primary" />
                    <span>
                      <strong className="font-semibold block text-xs text-muted-foreground uppercase">
                        Time
                      </strong>
                      {order.mealFor}
                    </span>
                  </div>

                  {order.description && (
                    <div className="bg-muted/50 p-3 rounded-md text-sm italic text-muted-foreground border-l-2 border-primary/40">
                      "{order.description}"
                    </div>
                  )}

                  <div className="pt-2 border-t mt-4 flex justify-between items-end">
                    <div className="text-xs text-muted-foreground">
                      Ordered: {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      ₹{order.totalAmount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
