import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBalanceRequestDetailsById } from "@/helpers/client/add-balance";
import Loader from "@/components/ui/Loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type BalanceRequestCardProps = {
  reqId?: string;
};

function BalanceRequestCard({ reqId }: BalanceRequestCardProps) {
  const {
    data: request,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["balanceRequestDetails", reqId],
    queryFn: () => getBalanceRequestDetailsById(reqId || ""),
    enabled: !!reqId,
    retry: false,
  });

  if (isFetching) return <Loader />;
  if (error)
    return <p className="text-red-500">Error: {(error as Error).message}</p>;
  if (!request) return <p>No request found.</p>;

  return (
    <Card className="w-full max-w-7xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Payment Request</CardTitle>
        <p className="text-sm text-muted-foreground">
          Submitted by {request.user?.fullName || "Unknown"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Amount:</span>
          <span>₹{request.amountAdded}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Payment Mode:</span>
          <span>{request.paymentMode}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          <Badge variant="outline" className="uppercase">
            {request.status}
          </Badge>
        </div>
        <div>
          <span className="font-medium block mb-2">Screenshot:</span>
          <Link
            href={request?.paymentScreenshot || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {request?.paymentScreenshot && (
              <Image
              width={500}
              height={300}
                src={request.paymentScreenshot}
                alt="Payment Screenshot"
                className="rounded-md w-full max-h-64 object-contain border"
              />
            )}
          </Link>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="destructive">Reject</Button>
        <Button variant="default">Approve</Button>
      </CardFooter>
    </Card>
  );
}

export default BalanceRequestCard;
