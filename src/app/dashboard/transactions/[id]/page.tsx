"use client";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { getTransactionById } from "@/helpers/client/admin.transactions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

function TransactionDetailsPage() {
  const { id } = useParams();
  const { data, error, isFetching } = useQuery({
    queryKey: ["getTransactionById", id],
    queryFn: () => getTransactionById(id as string),
  });
  if (error) {
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  console.log("data", data);
  return (
    <div>
      <Card>
        <CardContent>
          <div>
            <strong>Transaction ID:</strong> {data?._id}
          </div>
          <div>
            <strong>Amount:</strong> ${data?.amount}
          </div>
          <div>
            <strong>User:</strong> {data?.user?.fullName}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionDetailsPage;
