import { IUser } from "@/models/user.model";
import UserTransactions from "./transactions/UserTransactions";

function UserDashboard({ user }: { user: IUser }) {
  return (
    <div className="px-2 pb-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          Welcome, {user.fullName}!
        </h1>
      </div>
      <UserTransactions />
    </div>
  );
}

export default UserDashboard;
