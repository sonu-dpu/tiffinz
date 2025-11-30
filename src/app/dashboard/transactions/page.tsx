"use client";
import { TransactionItem } from "@/components/dashboard/transactions/UserTransactions";
import Loader from "@/components/ui/Loader";
import { UserRole } from "@/constants/enum";
import { getAllTransactions } from "@/helpers/client/admin.transactions";
import { getUserTransactions } from "@/helpers/client/user.transactions";

import useCurrentUser from "@/hooks/useCurrentUser";
import { ITransactionWithUser } from "@/models/transaction.model";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

function TransactionsPage() {
  const {userRole} = useCurrentUser();
  const queryFn = userRole === UserRole.admin ? getAllTransactions : getUserTransactions
  const { data, error, isFetching } = useQuery({
    queryKey: ["getAllTransactionsAdmin"],
    queryFn:()=>queryFn({page:0}),
    enabled: true,
  });
  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  const transactionDocs = data?.transactions;
  if (!transactionDocs.length) {
    return <div className="text-center text-muted-foreground flex justify-center gap-2"><AlertCircle/> No transactions found</div>;
  }
  return (
    <div className="flex justify-center flex-col max-w-[600px] mx-auto">
      {transactionDocs.map((transaction: ITransactionWithUser) => (
          <TransactionItem transaction={transaction} key={String(transaction._id)}  />
      ))}
    </div>
  );
}

export default TransactionsPage;
