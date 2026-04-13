"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  ClipboardList,
  IndianRupee,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Order } from "./OrderCard";
import { getSmartDate } from "@/lib/date-format";
import { formatToIndianCurrency } from "@/lib/utils";
import { MealStatus } from "@/constants/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMealOrderStatus } from "@/helpers/client/admin.meals";
import { updateMyMealOrderStatus } from "@/helpers/client/meal";
import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@/constants/enum";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusStyles = {
  ORDERED:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  TAKEN:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED:
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
  NOT_TAKEN:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800",
};

export default function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
}: OrderDetailsDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<MealStatus | null>(null);
  const { userRole } = useCurrentUser();
  const isAdmin = userRole === UserRole.admin;

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MealStatus }) =>
      isAdmin
        ? updateMealOrderStatus(id, status)
        : updateMyMealOrderStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getOrders"] });
      toast.success("Order status updated successfully");
      onClose();
      if (data?.transaction?._id) {
        router.push(`/dashboard/transactions/${data.transaction._id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status");
    },
    onSettled: () => {
      setIsUpdating(false);
      setConfirmStatus(null);
    },
  });

  const handleUpdateStatus = (status: MealStatus) => {
    if (!order) return;
    setConfirmStatus(status);
  };

  const executeUpdate = () => {
    if (!order || !confirmStatus) return;
    setIsUpdating(true);
    mutation.mutate({ id: order._id, status: confirmStatus });
  };

  if (!order) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center text-xl mt-4">
              Order Details
              <Badge
                variant="outline"
                className={`capitalize flex items-center gap-1.5 px-2.5 py-1 font-semibold border ${
                  statusStyles[
                    order.status.toUpperCase() as keyof typeof statusStyles
                  ]
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {order.status.toLowerCase()}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-6 text-sm">
            <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/30">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Customer
                </span>
                <span className="font-semibold text-base">
                  {order.user.fullName}
                </span>
                <span className="text-xs text-muted-foreground">
                  ID: {order.user._id}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/30">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Meal Information
                </span>
                <span className="font-semibold text-base">
                  {order.baseMealName || "Standard Meal"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold"
                  >
                    {order.mealFor}
                  </Badge>
                  {order.extras > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-bold"
                    >
                      +{order.extras} Extras
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/30">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Date
                  </span>
                  <span className="font-semibold">
                    {getSmartDate(order.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/30">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Amount
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatToIndianCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.status !== MealStatus.taken &&
            order.status !== MealStatus.cancelled && (
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold"
                  onClick={() => handleUpdateStatus(MealStatus.cancelled)}
                  disabled={isUpdating}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Cancel Order
                </Button>
                {isAdmin && (
                  <Button
                    className="flex-1 rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    onClick={() => handleUpdateStatus(MealStatus.taken)}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Set as Taken
                  </Button>
                )}
              </DialogFooter>
            )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmStatus}
        onOpenChange={(open) => !open && setConfirmStatus(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmStatus === MealStatus.taken
                ? "This will mark the order as taken and deduct the amount from the user's wallet. This action cannot be undone."
                : "This will cancel the order. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                executeUpdate();
              }}
              disabled={isUpdating}
              className={
                confirmStatus === MealStatus.cancelled
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isUpdating ? "Updating..." : "Yes, confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
