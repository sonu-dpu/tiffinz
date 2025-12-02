"use client";
import AddBalanceForm from "@/components/dashboard/admin/accounts/AddBalanceForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WithDrawer from "@/components/ui/withDrawer";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { setSelectedUser } from "@/store/usersSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, CircleX, PlusCircleIcon } from "lucide-react";
import { IUserWithAccount } from "@/helpers/client/admin.users";
import { useRouter } from "next/navigation";
export default function UserDetailsCard({ user }: { user: IUserWithAccount }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectUserForMealRecord = () => {
    dispatch(setSelectedUser(user));
    router.push(`./${user._id}/meals/mark`);
  };

  return (
    <Card className="rounded-xl shadow-md w-full max-w-3xl mx-auto">
      {/* HEADER */}
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">
              User Details
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {String(user._id)}
            </p>
          </div>

          {/* Verified Badge on right for larger screens */}
          <Badge
            variant={user.isVerified ? "default" : "outline"}
            className="flex items-center gap-1 px-3 py-1 text-sm mt-4 md:mt-0"
          >
            {user.isVerified ? <BadgeCheck size={16} /> : <CircleX size={16} />}
            {user.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="space-y-8">
        {/* TOP SECTION (Avatar + Basic Info) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Avatar className="h-20 w-20 rounded-full overflow-hidden">
            <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
            <AvatarFallback className="text-xl font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* GRID INFO SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p className="text-base font-medium">{user.phone}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base font-medium">{user.email}</p>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="text-base font-medium">{user.role}</p>
          </div>

          {/* Balance */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account Balance
            </p>
            <p className="text-base font-semibold text-indigo-600">
              {user.account?.balance?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              }) ?? "₹0.00"}
            </p>
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account Created At
            </p>
            <p className="text-base font-medium">
              {getDateAndTimeString(String(user.account?.createdAt))}
            </p>
          </div>

          {/* Updated At */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account Updated At
            </p>
            <p className="text-base font-medium">
              {getDateAndTimeString(String(user.account?.updatedAt))}
            </p>
          </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row gap-3">
        <WithDrawer
          drawerTriggerText="Add Balance"
          drawerTriggerIcon={<PlusCircleIcon className="w-4 h-4" />}
        >
          <AddBalanceForm className="bg-transparent border-none max-w-md mx-auto" />
        </WithDrawer>
              
        <Button onClick={selectUserForMealRecord} className="w-full sm:w-auto">
          Record Meal
        </Button>
      </CardFooter>
    </Card>
  );
}
