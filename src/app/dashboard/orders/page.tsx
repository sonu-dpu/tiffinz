"use client";

import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getMealOrders } from "@/helpers/client/admin.meals";
import { DailyMealFor, MealStatus } from "@/constants/enum";


import OrderCard, { Order } from "@/components/dashboard/admin/orders/OrderCard";

export default function MyOrdersPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const mealFor = searchParams.get("mealFor") || "";
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["getMealOrders", status, mealFor],
    queryFn: () =>
      getMealOrders({
        status: status as MealStatus,
        mealFor: mealFor as DailyMealFor,
      }),
    // enabled: false,
  });

  const handleViewDetails = (order: Order) => {
    console.log("Open details for:", order);
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold my-2">Orders</h2>
      <div className="space-y-2">
        {orders?.map((order: Order) => {
          return (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          );
        })}
      </div>
    </div>
  );
}

// const orders: Order[] = [
//   {
//     _id: "ord_001",
//     mealFor: DailyMealFor.breakfast,
//     totalAmount: 80,
//     status: MealStatus.ordered,
//     createdAt: new Date().toISOString(),
//     baseMealName: "Poha",
//     extras: 10,
//     user: {
//       _id: "user_001",
//       fullName: "Rahul Sharma",
//     },
//   },
//   {
//     _id: "ord_002",
//     mealFor: DailyMealFor.lunch,
//     totalAmount: 120,
//     status: MealStatus.taken,
//     createdAt: new Date().toISOString(),
//     baseMealName: "Dal Rice",
//     extras: 20,
//     user: {
//       _id: "user_002",
//       fullName: "Priya Verma",
//     },
//   },
//   {
//     _id: "ord_003",
//     mealFor: DailyMealFor.dinner,
//     totalAmount: 150,
//     status: MealStatus.cancelled,
//     createdAt: new Date().toISOString(),
//     baseMealName: "Paneer Sabzi",
//     extras: 30,
//     user: {
//       _id: "user_003",
//       fullName: "Amit Patel",
//     },
//   },
//   {
//     _id: "ord_004",
//     mealFor: DailyMealFor.lunch,
//     totalAmount: 110,
//     status: MealStatus.not_taken,
//     createdAt: new Date().toISOString(),
//     extras: 0,
//     user: {
//       _id: "user_004",
//       fullName: "Sneha Kulkarni",
//     },
//   },
// ];
