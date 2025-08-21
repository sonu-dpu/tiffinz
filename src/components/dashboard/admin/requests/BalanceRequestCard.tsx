import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBalanceRequestDetailsById,
  verifyBalanceRequest,
} from "@/helpers/client/add-balance";
import Loader from "@/components/ui/Loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import LoaderButton from "@/components/ui/loader-button";
import { PaymentStatus } from "@/constants/enum";

type BalanceRequestCardProps = {
  reqId?: string;
};

function BalanceRequestCard({ reqId }: BalanceRequestCardProps) {
  const queryClient = useQueryClient();
  const [currentAction, setCurrentAction] = React.useState<
    "approve" | "reject" | null
  >(null);

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

  const mutation = useMutation({
    mutationFn: (action: "approve" | "reject") =>
      verifyBalanceRequest(reqId || "", action),
    onSuccess: (_, variables) => {
      toast.success(
        `Request ${
          variables === "approve" ? "approved" : "rejected"
        } successfully`
      );
      queryClient.invalidateQueries({
        queryKey: ["balanceRequestDetails", reqId],
      });
      setCurrentAction(null);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
      setCurrentAction(null);
    },
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
      {request.status === PaymentStatus.pending && (
        <CardFooter className="flex justify-end gap-2">
          <LoaderButton
            variant="destructive"
            fallbackText="Rejecting..."
            isLoading={mutation.isPending && currentAction === "reject"}
            disabled={mutation.isPending}
            onClick={() => {
              setCurrentAction("reject");
              mutation.mutate("reject");
            }}
          >
            Reject
          </LoaderButton>
          <LoaderButton
            fallbackText="Approving..."
            variant="default"
            isLoading={mutation.isPending && currentAction === "approve"}
            disabled={mutation.isPending}
            onClick={() => {
              setCurrentAction("approve");
              mutation.mutate("approve");
            }}
          >
            Approve
          </LoaderButton>
        </CardFooter>
      )}
    </Card>
  );
}

export default BalanceRequestCard;
