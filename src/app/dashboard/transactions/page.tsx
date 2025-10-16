"use client";

import TransactionsCard from "@/components/dashboard/admin/transactions/TransactionsCard";
import Loader from "@/components/ui/Loader";
import { getAllTransactions } from "@/helpers/client/admin.transactions";
import { ITransaction } from "@/models/transaction.model";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function TransactionsPage() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllTransactionsAdmin"],
    queryFn: getAllTransactions,
    enabled: true,
  });
  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  const transactionDocs = data?.transactions?.docs;

  return (
    <div className="flex justify-center gap-2 flex-col max-w-[600px]">
      {transactionDocs.map((transaction: ITransaction) => (
        <Link href={`./transactions/${transaction._id}`} key={String(transaction._id)}>
          <TransactionsCard transaction={transaction}  />
        </Link>
      ))}
    </div>
  );
}

export default TransactionsPage;
