"use client";
import { TransactionItem } from "@/components/dashboard/transactions/UserTransactions";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";

import { UserRole } from "@/constants/enum";
import { getAllTransactions } from "@/helpers/client/admin.transactions";
import { PaginatedResult } from "@/helpers/client/client.types";
import { getUserTransactions } from "@/helpers/client/user.transactions";

import useCurrentUser from "@/hooks/useCurrentUser";
import { ITransactionWithUser } from "@/models/transaction.model";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { userRole } = useCurrentUser();
  const queryFn =
    userRole === UserRole.admin ? getAllTransactions : getUserTransactions;
  const { data, error, isFetching } = useQuery<
    PaginatedResult<ITransactionWithUser>
  >({
    queryKey: ["getAllTransactionsAdmin", currentPage],
    queryFn: () => queryFn({ page: currentPage }),
    enabled: true,
  });
  if (isFetching) {
    return <Loader />;
  }
  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  } else if (!data) {
    return <div>No data found</div>;
  }

  const { docs, hasNextPage } = data;
  const transactionDocs = docs || [];
  if (!transactionDocs?.length) {
    return (
      <div className="text-center text-muted-foreground flex justify-center gap-2">
        <AlertCircle /> No transactions found
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-center flex-col max-w-[600px] mx-auto">
        {transactionDocs.map((transaction: ITransactionWithUser) => (
          <TransactionItem
            transaction={transaction}
            key={String(transaction._id)}
          />
        ))}
        <Button
          className="mx-auto"
          disabled={!hasNextPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Load More
        </Button>
      </div>
    </>
  );
}

export default TransactionsPage;
