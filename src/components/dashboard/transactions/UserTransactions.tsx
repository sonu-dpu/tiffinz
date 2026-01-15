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
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TransactionWithMealLog } from "@/helpers/client/client.types";

function UserTransactions() {
  const { user } = useCurrentUser();
  const {
    data: response,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getUserTransactions", user?._id],
    queryFn: () => getUserTransactions({ pageParam: 1 }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  if (isFetching && !error) {
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
        {transactions.map((transaction: TransactionWithMealLog) => (
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
  transaction: TransactionWithMealLog;
}) {
  const isCredit = transaction.type === TransactionType.credit;
  return (
    <Link href={`/dashboard/transactions/${transaction._id}`}>
      <div className="flex justify-between items-center p-4 hover:bg-accent/50 duration-100 border-b">
        <div className="flex gap-1 flex-col justify-center">
          {transaction.isMeal && <Badge variant={"secondary"}>Meal</Badge>}
          <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-xl">
            {getDateAndTimeString(
              transaction?.mealLog?.date || transaction.createdAt
            )}
          </span>
        </div>
        <div>
          <span
            className={cn(
              "font-medium",
              isCredit ? "text-green-600 dark:text-green-400" : "text-red-400"
            )}
          >
            {(isCredit ? "+" : "-") +
              formatToIndianCurrency(transaction.amount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
export default UserTransactions;
