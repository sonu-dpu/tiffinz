"use client";
import UserTransactionDetailsCard from "@/components/dashboard/transactions/UserTransactionDetailsCard";
import { useParams } from "next/navigation";

function TransactionDetailsPage() {
  const { id } = useParams();
  return <UserTransactionDetailsCard transactionId={String(id)}/>
}

export default TransactionDetailsPage;
