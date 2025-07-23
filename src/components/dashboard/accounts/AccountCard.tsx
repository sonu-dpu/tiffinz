"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { helperResponse } from "@/helpers/client/client.types";
import { getCurrentUserAccount } from "@/helpers/client/user.account";
import consumablePromise from "@/lib/consumablePromise";
import { IAccount } from "@/models/account.model";
import { ArrowLeftRight, PlusCircle } from "lucide-react";
import React, { use, useEffect, useState } from "react";
const cachedUserAccount = consumablePromise<helperResponse<IAccount>>(
  getCurrentUserAccount
);
function AccountCard() {
  const [account, setAccount] = useState<IAccount | null>(null);
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
  return (
    <Card>
      {error && (
        <CardContent>
          <p>{errors}</p>
        </CardContent>
      )}
      {account ?  <AccountCardContent account={account}></AccountCardContent> : <Loader/>}

      <CardFooter>
        <Button>
          <PlusCircle></PlusCircle> Add Balnace
        </Button>
        <Button variant={"outline"}><ArrowLeftRight></ArrowLeftRight> Transactions</Button>
      </CardFooter>
    </Card>
  );
}

const AccountCardContent = ({ account }: { account: IAccount }) => {
  console.log("account", account);
  return (
    <CardContent>
      <p>
        {account.user?.fullName}
      </p>
      <div>
        <p>Account Balance : {account.balance}</p>
      </div>
    </CardContent>
  );
};

export default AccountCard;
