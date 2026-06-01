"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { TransactionType } from "@/constants/enum";
import { getUserTransactions } from "@/helpers/client/user.transactions";
import { cn, formatToIndianCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getSmartDate } from "@/lib/date-format";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ITransactionWithUser } from "@/models/transaction.model";

function UserTransactions() {
  const { user } = useCurrentUser();
  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getUserTransactions", user?._id],
    queryFn: () => getUserTransactions({ pageParam: 1 }),
    refetchOnWindowFocus: false,
  });
  if (isLoading && !error) {
    return <Loader />;
  } else if (error) {
    toast.error(error.message);
  }

  const transactions = response.docs;
  if (transactions?.length == 0) {
    return null;
  }
  return (
    <Card className="w-full md:max-w-md mx-auto bg-transparent shadow-none px-0 mt-2">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-0 border-t">
        {transactions.map((transaction: ITransactionWithUser) => (
          <TransactionItem
            key={String(transaction._id)}
            transaction={transaction}
          />
        ))}
      </CardContent>
      <CardFooter>
        <Button className="mx-auto px-6" variant={"outline"} asChild>
          <Link href={"/dashboard/transactions"}>
            See All <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TransactionItem({
  transaction,
}: {
  transaction: ITransactionWithUser;
}) {
  const isCredit = transaction.type === TransactionType.credit;
  return (
    <Link href={`/dashboard/transactions/${transaction._id}`} prefetch={false}>
      <div className="border-b p-4 hover:bg-accent/50 transition-colors">
        <div className="mb-1">
          <div className="flex items-baseline justify-between gap-4">
            {/* Left Section */}
            <div className="flex flex-col gap-2 min-w-0">
              {transaction.isMeal && (
                <Badge variant="secondary" className="w-fit">
                  Meal
                </Badge>
              )}

              <span className="text-xs text-muted-foreground">
                {getSmartDate(transaction.createdAt!)}
              </span>
            </div>

            {/* Right Section */}
            <div className="text-right shrink-0">
              <div
                className={cn(
                  "text-lg font-medium",
                  isCredit
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-400",
                )}
              >
                {isCredit ? "+" : "-"}
                {formatToIndianCurrency(transaction.amount)}
              </div>

              <div className="text-xs text-muted-foreground">
                {isCredit ? "Credit" : "Debit"}
              </div>
            </div>
          </div>
        </div>
        {transaction.openingBalance != null &&
          transaction.closingBalance != null && (
            <div className="text-xs text-muted-foreground ">
              Bal:{" "}
              <span className="font">
                {formatToIndianCurrency(transaction.openingBalance)}
              </span>
              <ArrowRight className="inline-block w-6 px-1" />
              <span
                className={cn(
                  "font-medium",
                  transaction.closingBalance <= 0 && "text-red-400",
                )}
              >
                {formatToIndianCurrency(transaction.closingBalance)}
              </span>
            </div>
          )}
      </div>
    </Link>
  );
}
export default UserTransactions;
