import { IUser } from "@/models/user.model";
import AccountCard from "@/components/dashboard/wallet/AccountCard";
import MealLogsList from "./meals/MealLogsList";

function UserDashboard({ user }: { user: IUser }) {
  return (
    <div className="px-2 py-4">
      <h1 className="text-2xl font-semibold mb-2">Welcome, {user.fullName}!</h1>
      <AccountCard />
      <MealLogsList userId={user._id?.toString() as string} />
      {/* <UserTransactions /> */}
    </div>
  );
}

export default UserDashboard;
