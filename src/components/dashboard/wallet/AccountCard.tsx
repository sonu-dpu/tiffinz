"use client";
import WithDrawer from "@/components/ui/withDrawer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { getCurrentUserAccount } from "@/helpers/client/user.account";

import { IAccountWithUser } from "@/models/account.model";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import AddBalanceForm from "../add-balance/AddBalanceForm";
import { useQuery } from "@tanstack/react-query";
import { formatToIndianCurrency } from "@/lib/utils";

function AccountCard() {
  const [account, setAccount] = useState<IAccountWithUser | null>(null);
  const { data, error } = useQuery({
    queryKey: ["currentUserAccount"],
    queryFn: getCurrentUserAccount,
    retry: false,
  });
  useEffect(() => {
    if (data) {
      setAccount(data as IAccountWithUser);
    }
  }, [data]);

  if (error) {
    return (
      <Card>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  } else if (account) {
    return (
      <Card className="w-full md:max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {account.user.fullName}
          </CardTitle>
          <CardDescription>Account ID: {String(account._id)}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">
              Available Balance
            </span>
            <span className="text-lg font-bold text-primary">
              {formatToIndianCurrency(account.balance)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <ActionButtons />
        </CardFooter>
      </Card>
    );
  } else {
    return <Loader />;
  }
}

const ActionButtons = () => {
  return (
    <>
      <WithDrawer
        drawerTriggerText="Add Balance"
        drawerTriggerIcon={<PlusCircleIcon />}
      >
        <AddBalanceForm className="border-none shadow-none" />
      </WithDrawer>

      {/* <Button variant={"outline"}>
        <ArrowLeftRight></ArrowLeftRight> Transactions
      </Button> */}
    </>
  );
};
export default AccountCard;
