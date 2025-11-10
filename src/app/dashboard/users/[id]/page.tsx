"use client";
import { AddBalanceForm } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import WithDrawer from "@/components/ui/withDrawer";
import {
  getUserWithAccount,
  IUserWithAccount,
} from "@/helpers/client/admin.users";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setSelectedUser } from "@/store/usersSlice";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function UserPage() {
  const { id: userId } = useParams();
  const {
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["userWithAccount", String(userId)],
    queryFn: () => getUserWithAccount(String(userId)),
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(error.message);
  }
  if (isFetching) {
    return <Loader />;
  } else if (user) {
    return <UserCard user={user} />;
  }
}

const UserCard = ({ user }: { user: IUserWithAccount }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selectUserForMealRecord = () => {
    dispatch(setSelectedUser(user));
    router.push(`./${user._id}/meals/mark`);
  };
  return (
    <Card className="max-w-7xl mx-auto shadow-lg rounded-lg border border-gray-200 bg-white">
      <CardHeader className="flex items-center gap-4 p-4 border-b border-gray-100">
        <Image
          alt={user.fullName}
          src={user.avatar || "/profileAvatar.png"}
          width={64}
          height={64}
          className="rounded-full object-cover border"
        />
        <CardTitle className="text-xl font-semibold">{user.fullName}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-3 text-sm text-gray-700">
        <div className="space-y-4 text-gray-800">
          <p className="flex justify-between border-b border-gray-200 pb-2">
            <strong className="text-gray-700">Id:</strong>
            <span className="font-medium text-gray-900">
              {String(user._id)}
            </span>
          </p>
          <p className="flex justify-between border-b border-gray-200 pb-2">
            <strong className="text-gray-700">Username:</strong>
            <span className="font-medium text-gray-900">{user.username}</span>
          </p>

          <p className="flex justify-between border-b border-gray-200 pb-2">
            <strong className="text-gray-700">Email:</strong>
            <span className="font-medium text-gray-900">{user.email}</span>
          </p>

          <p className="flex justify-between border-b border-gray-200 pb-2">
            <strong className="text-gray-700">Phone:</strong>
            <span className="font-medium text-gray-900">{user.phone}</span>
          </p>

          <p className="flex justify-between border-b border-gray-200 pb-2">
            <strong className="text-gray-700">Role:</strong>
            <span className="font-medium text-gray-900">{user.role}</span>
          </p>

          <p className="flex justify-between border-b border-gray-200 pb-2">
            <strong className="text-gray-700">Verified:</strong>
            <span
              className={
                user.isVerified
                  ? "text-green-600 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {user.isVerified ? "Yes" : "No"}
            </span>
          </p>

          <p className="flex justify-between">
            <strong className="text-gray-700">Account Balance:</strong>
            <span className="font-semibold text-indigo-600">
              {user.account?.balance?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              }) ?? "₹0.00"}
            </span>
          </p>
        </div>

        <p>
          <strong>Account Created At:</strong>{" "}
          {new Date(String(user.account?.createdAt)).toLocaleDateString()}
        </p>
        <p>
          <strong>Account Updated At:</strong>{" "}
          {new Date(String(user.account?.updatedAt)).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="p-4 border-t border-gray-100">
        <WithDrawer
          drawerTriggerText="Add Balance"
          drawerTriggerIcon={<PlusCircleIcon className="w-4 h-4" />}
        >
          <AddBalanceForm className="border-none" />
        </WithDrawer>

        <Button onClick={selectUserForMealRecord}>Record Meal</Button>
      </CardFooter>
    </Card>
  );
};

export default UserPage;
