"use client";

import MealLogCard from "@/components/dashboard/meals/MealLogCard";
import { TransactionCard } from "@/components/dashboard/transactions/UserTransactionDetailsCard";
import Loader from "@/components/ui/Loader";
import { getMealLogById } from "@/helpers/client/meal";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function MealLogByIdPage() {
  const { id: mealLogId } = useParams();
  const {
    data: mealLog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getMealLogById", mealLogId],
    queryFn: () => getMealLogById(String(mealLogId)),
    refetchOnWindowFocus: false,
    retry: false,
  });
  const transaction = mealLog?.transaction;
  if (isLoading) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 text-sm text-destructive">
        Unable to load meal log details.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <MealLogCard mealLog={mealLog} />
      {transaction && <TransactionCard transaction={transaction} />}
    </div>
  );
}

export default MealLogByIdPage;
