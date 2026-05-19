import { IUser } from "@/models/user.model";

function UserDashboard({ user }: { user: IUser }) {
  return (
    <div className="px-2 py-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          Welcome, {user.fullName}!
        </h1>
      </div>
    </div>
  );
}

export default UserDashboard;
