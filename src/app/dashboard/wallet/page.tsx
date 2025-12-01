import AccountCard  from "@/components/dashboard/wallet/AccountCard";
import UserTransactions from "@/components/dashboard/transactions/UserTransactions";

function WalletPage() {
  return (
    <div>
      <AccountCard />
      <UserTransactions />
    </div>
  );
}

export default WalletPage;
