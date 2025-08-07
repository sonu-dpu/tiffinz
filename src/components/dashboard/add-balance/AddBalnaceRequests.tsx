"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentMode, PaymentStatus } from "@/constants/enum";
import {
  getAllBalanceRequests,
  IAddBalanceRequestWithUser,
} from "@/helpers/client/add-balance";
import { useQuery } from "@tanstack/react-query";
// import { ImageKitProvider } from "@imagekit/next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function AddBalnaceRequests() {
  const {
    data: requests,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["allBalanceRequests"],
    queryFn: getAllBalanceRequests,
    retry: false,
  });

  if (isFetching) {
    return <Loader />;
  }
  if (error) {
    toast.error(error.message);
    return <p>{error.message}</p>;
  }
  return (
    <div className="flex justify-center flex-wrap">
      <div className="border p-4 max-w-7xl w-full">
        {/* <ImageKitProvider urlEndpoint="https://ik.imagekit.io/8qwpwqueu">
          {requests.length > 0 &&
            requests?.map((req) => (
              <RequestCard key={String(req._id)} request={req}></RequestCard>
            ))}
        </ImageKitProvider> */}
        <BalanceRequestTable requests={requests || []} />
      </div>
    </div>
  );
}
export const RequestCard = ({
  request,
}: {
  request: IAddBalanceRequestWithUser;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{request.user.fullName}</CardTitle>
      </CardHeader>
      <CardContent>
        {request.status === PaymentStatus.pending ? (
          <Button>Verify</Button>
        ) : (
          <Button variant={"success"}>Verified</Button>
        )}
        {request.paymentMode === PaymentMode.online && (
          <Image
            alt={String(request._id)}
            height={100}
            width={100}
            src={
              request?.paymentScreenshot
                ? request.paymentScreenshot
                : "/file.svg"
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

const BalanceRequestTable = ({
  requests,
}: {
  requests: IAddBalanceRequestWithUser[];
}) => {
  if (requests?.length <= 0) {
    return <div>Not Requests Found..</div>;
  }
  const theadings = ["SrNo.", "Req Id", "Name", "Email", "Amount", "Status"];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {theadings.map((th) => (
            <TableHead key={th}>{th}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {requests.map((req, i) => (
          <TableRow key={String(req._id) + i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>
              <Link href={`/dashboard/requests/${String(req._id)}`}>
                {String(req._id)}
              </Link>
            </TableCell>
            <TableCell>{req.user.fullName}</TableCell>
            <TableCell>{req.user?.email || "-"}</TableCell>
            <TableCell>{req.amountAdded}</TableCell>
            <TableCell>{req.status}</TableCell>
            {/* <TableCell>{req.status}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AddBalnaceRequests;
