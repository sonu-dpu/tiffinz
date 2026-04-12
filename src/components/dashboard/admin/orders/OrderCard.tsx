"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { getSmartDate } from "@/lib/date-format";
import { formatToIndianCurrency } from "@/lib/utils";
import { DailyMealFor, MealStatus } from "@/constants/enum";

export type Order = {
  _id: string;
  mealFor: DailyMealFor;
  totalAmount: number;
  status: MealStatus;
  createdAt: string;
  baseMealName?: string;
  extras: number;
  user: {
    _id: string;
    fullName: string;
  };
};

const statusStyles = {
  ORDERED: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  TAKEN: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
  NOT_TAKEN: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800",
};

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  return (
    <Card className="rounded-2xl shadow-sm border-muted/40 hover:shadow-md transition-shadow duration-300 py-0 gap-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          {order.user.fullName}
        </CardTitle>

        <Badge
          variant="outline"
          className={`capitalize flex items-center gap-1.5 px-2.5 py-0.5 font-medium border ${
            statusStyles[order.status.toUpperCase() as keyof typeof statusStyles]
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {order.status.toLowerCase()}
        </Badge>
      </CardHeader>

      <CardContent className="px-4 py-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-foreground/90">
              {order.baseMealName || "Standard Meal"}{" "}
              {order.extras > 0 && (
                <span className="text-muted-foreground font-normal ml-1">
                  + {order.extras} Extras
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-bold uppercase tracking-wider bg-secondary/50">
                {order.mealFor}
              </Badge>
              <span className="text-sm font-bold text-primary">
                {formatToIndianCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-4 py-2">
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
          <Calendar size={13} className="opacity-70" />
          {getSmartDate(order.createdAt)}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8 px-3 hover:bg-primary/5 hover:text-primary transition-colors gap-1.5 font-medium"
          onClick={() => onViewDetails(order)}
        >
          View Details <ArrowRight size={14} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
