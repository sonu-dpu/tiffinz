"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { TransactionType } from "@/constants/enum";
import { getUserTransactions } from "@/helpers/client/user.transactions";
import { formatToIndianCurrency } from "@/lib/utils";
import { ITransaction } from "@/models/transaction.model";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import useCurrentUser from "@/hooks/useCurrentUser";

function UserTransactions() {
  const { user } = useCurrentUser();
  const [page, setPage] = useState(1);
  const {
    data: response,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getUserTransactions", page, user?._id],
    queryFn: () => getUserTransactions({ page }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  if (isFetching && !error) {
    return <Loader />;
  } else if (error) {
    toast.error(error.message);
  }
  const transactions = response.transactions;
  return (
    <Card className="w-full md:max-w-md mx-auto bg-transparent shadow-none px-0 mt-2">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-0 border-t">
        {transactions.map((transaction: ITransaction) => (
          <TransactionItem
            key={String(transaction._id)}
            transaction={transaction}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function TransactionItem({
  transaction,
}: {
  transaction: ITransaction;
}) {
  return (
    <Link href={`/dashboard/transactions/${transaction._id}`}>
      <div className="flex justify-between items-center p-4 hover:bg-accent duration-100 border-b">
        <div className="flex gap-1 flex-col justify-center">
          {transaction.isMeal && <Badge>Meal</Badge>}
          <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-xl">
            {getDateAndTimeString(transaction.createdAt!)}
          </span>
        </div>
        <div>
          <span
            className={`font-medium ${
              transaction.type === TransactionType.credit
                ? "text-green-600 dark:text-green-400"
                : "text-red-400"
            }`}
          >
            {transaction.type === TransactionType.credit ? "+" : "-"}{" "}
            {formatToIndianCurrency(transaction.amount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
export default UserTransactions;
