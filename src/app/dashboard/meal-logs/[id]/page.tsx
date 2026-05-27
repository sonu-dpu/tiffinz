"use client";

import MealLogCard from "@/components/dashboard/meals/MealLogCard";
import { TransactionCard } from "@/components/dashboard/transactions/UserTransactionDetailsCard";
import Loader from "@/components/ui/Loader";
import { getMealLogById } from "@/helpers/client/meal";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function MealLogByIdPage() {
  const { id: mealLogId } = useParams();
  const { data: mealLog, isLoading } = useQuery({
    queryKey: ["getMealLogById", mealLogId],
    queryFn: () => getMealLogById(String(mealLogId)),
    refetchOnWindowFocus: false,
  });
  const transaction = mealLog?.transaction;
  if (isLoading) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }
  return (
    <div className="space-y-6 p-4">
      <MealLogCard mealLog={mealLog} />
      {transaction && <TransactionCard transaction={transaction} />}
    </div>
  );
}

export default MealLogByIdPage;
