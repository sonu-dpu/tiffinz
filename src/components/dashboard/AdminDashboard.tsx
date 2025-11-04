"use client";

import { IUser } from "@/models/user.model";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/Loader";
import { PaymentStatus } from "@/constants/enum";
import { getRequests } from "@/helpers/client/add-balance";
import { Button } from "../ui/button";
import Link from "next/link";
import ExampleCharts from "../example-chart";
import { getUsers } from "@/helpers/client/admin.users";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setUsers } from "@/store/usersSlice";

function AdminDashboard({ user }: { user: IUser }) {
  return (
    <div>
      <div>Welcome {user.fullName}</div>
      <div className="flex flex-wrap gap-2 items-start justify-center">
        <RequestCountCard/>
        <UsersCountCard/>
        <ExampleCharts />
      </div>
    </div>
  );
}
export async function getRequestsCount(status?: PaymentStatus) {
  return getRequests({ status, count: true });
}
export async function getUsersCount(isVerified?:boolean) {
  return getUsers({count:true, isVerified})
}
export function RequestCountCard() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["getPendingRequestsCount", PaymentStatus.pending],
    queryFn: () => getRequestsCount(PaymentStatus.pending),
    refetchOnWindowFocus:false
  });

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Pending Requests
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-center py-6">
        {isFetching ? (
          <Loader />
        ) : error instanceof Error ? (
          <p className="text-sm text-red-500">{error.message}</p>
        ) : (
          <p className="text-3xl font-bold text-primary">{data?.count ?? 0}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild variant="outline">
          <Link href={"/dashboard/requests"}>View Requests</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function UsersCountCard(){
  const { data, error, isFetching } = useQuery({
    queryKey: ["getUnVerifiedUsers",false],
    queryFn: () => getUsersCount(false),
    refetchOnWindowFocus:false
  });
  const dispatch = useAppDispatch();
  return <Card className="w-full max-w-sm rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Unverified Users
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-center py-6">
        {isFetching ? (
          <Loader />
        ) : error instanceof Error ? (
          <p className="text-sm text-red-500">{error.message}</p>
        ) : (
          <p className="text-3xl font-bold text-primary">{data?.count ?? 0}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild variant="outline" onClick={()=>dispatch(setUsers(""))}>
          <Link href={"/dashboard/users?verified=false"}>View Users</Link>
        </Button>
      </CardFooter>
    </Card>
}


export default AdminDashboard;
