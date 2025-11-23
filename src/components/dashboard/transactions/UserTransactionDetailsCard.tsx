"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { TransactionType, UserRole } from "@/constants/enum";

import { getTransactionById } from "@/helpers/client/admin.transactions";
import { getUserTransactionById } from "@/helpers/client/user.transactions";

import useCurrentUser from "@/hooks/useCurrentUser";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { cn, formatToIndianCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";

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
  );
}

export default UserTransactionDetailsCard;
