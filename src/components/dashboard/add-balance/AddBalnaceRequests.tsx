"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { Table, TableBody, TableHead } from "@/components/ui/table";
import { PaymentMode, PaymentStatus } from "@/constants/enum";
import { getAllBalanceRequests, IAddBalanceRequestWithUser } from "@/helpers/client/add-balance";
// import { ImageKitProvider } from "@imagekit/next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function AddBalnaceRequests() {
  const [requests, setRequests] = useState<IAddBalanceRequestWithUser[] | null>(null);
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await getAllBalanceRequests();
      console.log("data", data);
      if (error) {
        toast.error("Error fethinf data");
      }
      setRequests(data ?? []);
    }
    fetchData();
  }, []);
  if (!requests) {
    return <Loader />;
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
        <BalanceRequestTable requests ={requests} />
      </div>
    </div>
  );
}
export const RequestCard = ({ request }: { request: IAddBalanceRequestWithUser }) => {
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


const BalanceRequestTable = ({requests}:{requests:IAddBalanceRequestWithUser[]})=>{
  if(requests?.length <= 0){
    return <div>Not Requests Found..</div>
  }
  return (
    <Table>
      <TableHead>

      </TableHead>
      <TableBody>

      </TableBody>
    </Table>
  )
}
export default AddBalnaceRequests;
