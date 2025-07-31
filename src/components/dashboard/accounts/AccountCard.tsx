"use client";
import WithDrawer from "@/components/ui/withDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { helperResponse } from "@/helpers/client/client.types";
import { getCurrentUserAccount } from "@/helpers/client/user.account";
import consumablePromise from "@/lib/consumablePromise";
import { IAccountWithUser } from "@/models/account.model";
import { ArrowLeftRight, PlusCircleIcon } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import AddBalanceForm from "../add-balance/AddBalanceForm";
const cachedUserAccount = consumablePromise<helperResponse<IAccountWithUser>>(
  getCurrentUserAccount
);
function AccountCard() {
  const [account, setAccount] = useState<IAccountWithUser | null>(null);
  const [errors, setErrors] = useState<null | string>(null);

  const { data, error } = use(cachedUserAccount);
  console.log("error", error);
  useEffect(() => {
    if (error) {
      setErrors(error.message);
    }
    if (data) {
      setErrors("");
      setAccount(data);
    }
  }, [error, data]);

  if (errors) {
    return (
      <Card>
        <CardContent>
        <p>{errors}, wait for admin to verify your account, and check back later</p>

        </CardContent>
      </Card>
    );
  } else if (account) {
    return (
      <Card>
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
