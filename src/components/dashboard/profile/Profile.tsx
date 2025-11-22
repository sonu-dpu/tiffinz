import Loader from "@/components/ui/Loader";
import { IUser } from "@/models/user.model";
import AccountCard from "../accounts/AccountCard";
import UserTransactions from "../transactions/UserTransactions";

function Profile({ user }: { user: IUser | null }) {

  if(!user){
    return <Loader/>
  }
  return (
    <div>
     <AccountCard/>
     <UserTransactions/>
    </div>
  );
}

export default Profile;
