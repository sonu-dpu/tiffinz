import { AccountCard } from "@/components/dashboard";
import UserTransactions from "@/components/dashboard/transactions/UserTransactions";
import React from "react";

function WalletPage() {
  return (
    <div>
      <AccountCard />
      <UserTransactions />
    </div>
  );
}

export default WalletPage;
