"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, ShoppingBag } from "lucide-react";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";

interface Order {
  _id: string;
  date: string;
  mealFor: string;
  status: string;
  description?: string;
  totalAmount: number;
  createdAt: string;
  meal: {
    _id: string;
    name: string;
    type: string;
    price: number;
  };
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/meals/order/me");
        // AggregatePaginate returns docs array inside response.data.data.orders.docs
        const fetchedOrders = response.data?.data?.orders?.docs || [];
        setOrders(fetchedOrders);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ORDERED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "TAKEN":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
      case "CANCELLED ":
        return "bg-red-100 text-red-800 border-red-200";
      case "NOT_REQUIRED":
      case "NOT_TAKEN":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and track all your past and upcoming meal orders.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your orders...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`px-2.5 py-0.5 rounded-full uppercase text-[10px] font-bold ${getStatusColor(order.status)}`}
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
      )}
    </div>
  );
}
