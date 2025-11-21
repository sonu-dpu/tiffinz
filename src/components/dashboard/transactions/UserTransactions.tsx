"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { Separator } from "@/components/ui/separator";
import { TransactionType } from "@/constants/enum";
import { getUserTransactions } from "@/helpers/client/user.transactions";
import { formatToIndianCurrency } from "@/lib/utils";
import { ITransaction } from "@/models/transaction.model";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

function UserTransactions() {
  const [page, setPage] = useState(1);
  const {
    data: response,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getUserTransactions"],
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
    <Card className="w-full max-w-md mx-auto border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
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
    <div className="flex flex-col gap-1 py-2">
      <div className="flex justify-between items-center">
        <span
          className={`font-medium ${
            transaction.type === TransactionType.credit
              ? "text-green-300"
              : "text-red-400"
          }`}
        >
          {transaction.type === TransactionType.credit ? "+" : "-"}{" "}
          {formatToIndianCurrency(transaction.amount)}
        </span>
        {transaction.isMeal && <Badge>Meal</Badge>}
        <span className="text-xs text-muted-foreground">
          {new Date(String(transaction.createdAt)).toLocaleString()}
        </span>
      </div>

      <Separator />
    </div>
  );
}
export default UserTransactions;
