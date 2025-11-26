"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { MealStatus, TransactionType, UserRole } from "@/constants/enum";

import { getTransactionById } from "@/helpers/client/admin.transactions";
import { getUserTransactionById } from "@/helpers/client/user.transactions";

import useCurrentUser from "@/hooks/useCurrentUser";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { cn, formatToIndianCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { MealLogWithMealDetails } from "@/helpers/client/client.types";

function UserTransactionDetailsCard({
  transactionId,
}: {
  transactionId: string;
}) {
  const { userRole } = useCurrentUser();
  const queryFn =
    userRole === UserRole.admin ? getTransactionById : getUserTransactionById;
  const {
    data: transaction,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getTransactionById", transactionId],
    queryFn: () => queryFn(transactionId),
    refetchOnWindowFocus: false,
  });
  if (error) {
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  console.log("data", transaction);
  const isCredit = transaction.type === TransactionType.credit;
  const amount = `${isCredit ? "+" : "- "} ${formatToIndianCurrency(
    transaction.amount
  )}`;

  return (
    <>
    <Card className="w-full max-w-2xl shadow border border-border/60 mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Transaction Details
        </CardTitle>
        <p className="text-sm opacity-90 mt-1">
          Transaction ID: {String(transaction._id)}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Info */}
        {userRole === UserRole.admin && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 bg-amber-200 rounded-full flex justify-center items-center">
                  <AvatarImage
                    src={transaction.user.avatar}
                    alt={transaction.user.fullName}
                  />
                  <AvatarFallback>
                    {transaction.user.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {transaction.user.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    @{transaction.user.username}
                  </p>
                </div>
              </div>
              <Badge
                variant={transaction.user.isVerified ? "default" : "outline"}
              >
                <BadgeCheck />
                {transaction.user.isVerified ? "Verified" : "Unverified"}
              </Badge>
              <div>
                <span className="font-medium text-muted-foreground">
                  Phone:
                </span>
                <p>{transaction.user.phone}</p>
              </div>
            </div>
            <Separator />
          </>
        )}
        {/* Transaction Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>{getDateAndTimeString(transaction.createdAt)}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Amount:</span>
            <p className={cn("text-lg font-bold")}>{amount}</p>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Type:</span>
            <p>
              <Badge variant="outline">{transaction.type}</Badge>
            </p>
          </div>

          {userRole === UserRole.admin && (
            <>
              <div>
                <span className="font-medium text-muted-foreground">
                  User ID:
                </span>
                <p className="text-foreground">
                  {String(transaction.user._id)}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Account:
                </span>
                <p className="text-foreground">{String(transaction.account)}</p>
              </div>
            </>
          )}
        </div>

        <Separator />
        {transaction.isMeal && <Badge>Meal Transaction</Badge>}
        

      </CardContent>
    </Card>
    {transaction.isMeal && (<MealTransactionDetails mealLog={transaction.mealLog} />)}
    </>
  );
}

export function MealTransactionDetails({ mealLog }: { mealLog: MealLogWithMealDetails }) {
  const { meal, totalAmount, extras } = mealLog;

  return (
    <Card className="mt-4 max-w-2xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle className="text-lg">Meal Details</CardTitle>
          <p className="text-sm text-muted-foreground">A quick summary of the transaction</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          <Badge
            variant={
              mealLog.status === MealStatus.taken
                ? "secondary"
                : mealLog.status === MealStatus.not_taken
                ? "outline"
                : "destructive"
            }
            className="capitalize"
          >
            {mealLog.status}
          </Badge>

          {/* Small meta */}
          <div className="text-xs text-muted-foreground">
            <div>Logged: {getDateAndTimeString(mealLog.createdAt!)}</div>
            <div className="mt-0.5">Meal ID: <span className="font-medium">{String(meal._id)}</span></div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4">
        {/* Meal top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold">{String(meal.name)}</h4>
            <p className="text-xs text-muted-foreground">Meal SKU / reference: <span className="font-medium">{String(meal._id)}</span></p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">Base Price</p>
            <p className="text-lg">{formatToIndianCurrency(meal.price)}</p>
          </div>
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Price breakdown</p>

          <ul className=" list-inside space-y-1 text-sm text-muted-foreground">
            <li className="w-full flex justify-between">
              <span className="inline-block w-36 text-foreground">Base Price</span>
              <span className="font-medium">{formatToIndianCurrency(meal.price)}</span>
            </li>

            {extras && extras.length > 0 ? (
              <>
                <li>
                  <div className="text-foreground font-medium">Extras</div>
                  <ul className=" mt-1 space-y-1">
                    {extras.map((extra) => (
                      <li key={String(extra.extras._id)} className="flex justify-between gap-4">
                        <div>
                          <span className="inline-block w-28">{extra.extras.name}</span>{" "}
                        <span>
                           {extra.extras.price} x {extra.quantity}
                        </span>
                        </div>
                        <span className="font-medium">{formatToIndianCurrency(extra.extras.price * extra.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              </>
            ) : (
              <li className="text-muted-foreground">No extras</li>
            )}
          </ul>
        </div>

        <Separator />

        {/* Totals row */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Logged At</div>
          <div className="text-sm font-medium">{getDateAndTimeString(mealLog.createdAt!)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Total Amount</div>
          <div className="text-xl font-bold">{formatToIndianCurrency(totalAmount)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserTransactionDetailsCard;
