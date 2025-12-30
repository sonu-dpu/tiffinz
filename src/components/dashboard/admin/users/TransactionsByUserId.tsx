"use client";
import { getTransactionsByUserId } from "@/helpers/client/admin.transactions";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { ITransaction } from "@/models/transaction.model";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TransactionItem } from "../../transactions/UserTransactions";

function TransactionsByUserId({ userId }: { userId: string }) {
  const {
    data: response,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["transactionsByUserId", userId],
    queryFn: () => getTransactionsByUserId(userId),
  });
  console.log("response", response);
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
        {transactions.map((transaction: ITransaction) => (
          <TransactionItem
            key={String(transaction._id)}
            transaction={transaction}
          />
        ))}
      </CardContent>
      <CardFooter>
        <Button className="mx-auto px-6" variant={"outline"} asChild>
          <Link href={`/dashboard/transactions?user=${userId}`}>
            See All <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TransactionsByUserId;
