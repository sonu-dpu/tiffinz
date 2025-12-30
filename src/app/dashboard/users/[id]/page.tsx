"use client";
import TransactionsByUserId from "@/components/dashboard/admin/users/TransactionsByUserId";
import UserDetailsCard from "@/components/dashboard/admin/users/UserDetailsCard";
import Loader from "@/components/ui/Loader";
import { getUserWithAccount } from "@/helpers/client/admin.users";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

function UserPage() {
  const { id: userId } = useParams();
  const {
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["userWithAccount", String(userId)],
    queryFn: () => getUserWithAccount(String(userId)),
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(error.message);
  }
  if (isFetching) {
    return <Loader />;
  } else if (user) {
    return (
      <>
        <UserDetailsCard user={user} />
        <TransactionsByUserId userId={String(userId)} />
      </>
    );
  }
}

export default UserPage;
