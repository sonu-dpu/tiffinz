import Loader from "@/components/ui/Loader";
import React, { lazy, Suspense } from "react";
const AccountCard = lazy(
  () => import("@/components/dashboard/accounts/AccountCard")
);
function AccountPage() {
  return (
    <div>
      <Suspense fallback={<Loader/>}>
        <AccountCard></AccountCard>
      </Suspense>
    </div>
  );
}

export default AccountPage;
