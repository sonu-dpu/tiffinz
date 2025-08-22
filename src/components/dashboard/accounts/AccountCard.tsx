"use client";
import WithDrawer from "@/components/ui/withDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { getCurrentUserAccount } from "@/helpers/client/user.account";

import { IAccountWithUser } from "@/models/account.model";
import { ArrowLeftRight, PlusCircleIcon } from "lucide-react";
import React, {useEffect, useState } from "react";
import AddBalanceForm from "../add-balance/AddBalanceForm";
import { useQuery } from "@tanstack/react-query";

function AccountCard() {
  const [account, setAccount] = useState<IAccountWithUser | null>(null);
  const {data, error} = useQuery({
    queryKey: ["currentUserAccount"],
    queryFn: getCurrentUserAccount,
    retry: false,
  })
  useEffect(() => {
    if (data) {
      setAccount(data as IAccountWithUser);
    }
  }, [data]);

  if (error) {
    return (
      <Card>
        <CardContent>
        <p>{error.message}, wait for admin to verify your account, and check back later</p>

        </CardContent>
      </Card>
    );
  } else if (account) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <AccountCardContent account={account}></AccountCardContent>
        <ActionButtons/>
      </Card>
    );
  } else {
    return <Loader />;
  }
}



const AccountCardContent = ({ account }: { account: IAccountWithUser }) => {
  console.log("account", account.user.fullName);
  return (
    <CardContent>
      <div>
        <h2>{account.user.fullName}</h2>
      </div>
      <p>{account.id}</p>
      <div>
        <p>Account Balance : {account.balance}</p>
      </div>
    </CardContent>
  );
};

const ActionButtons = () => {
  return (
    <CardFooter>
      <WithDrawer
        drawerTriggerText="Add Balance"
        drawerTriggerIcon={<PlusCircleIcon />}
      >
        <AddBalanceForm className="border-none shadow-none" />
      </WithDrawer>

      <Button variant={"outline"}>
        <ArrowLeftRight></ArrowLeftRight> Transactions
      </Button>
    </CardFooter>
  );
};
export default AccountCard;
