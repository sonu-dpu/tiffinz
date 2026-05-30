"use client";
import TransactionsByUserId from "@/components/dashboard/admin/users/TransactionsByUserId";
// import TransactionsByUserId from "@/components/dashboard/admin/users/TransactionsByUserId";
import UserDetailsCard from "@/components/dashboard/admin/users/UserDetailsCard";
import UserProfileActions from "@/components/dashboard/admin/users/UserProfileActions";
// import UserMoreActions from "@/components/dashboard/admin/users/UserProfileActions";
import MealLogsList from "@/components/dashboard/meals/MealLogsList";
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
    isLoading,
  } = useQuery({
    queryKey: ["userWithAccount", String(userId)],
    queryFn: () => getUserWithAccount(String(userId)),
    refetchOnWindowFocus: false,
  });

  if (error) {
    toast.error(error.message);
  }
  if (isLoading) {
    return <Loader />;
  } else if (user) {
    return (
      <>
        <UserDetailsCard user={user} />
        <div className="space-y-6 gap-4 max-w-3xl mx-auto flex flex-col lg:flex-row justify-center items-start mt-4">
          <MealLogsList userId={userId as string} />
          <TransactionsByUserId userId={String(userId)} />
        </div>
        <UserProfileActions />
      </>
    );
  }
}

export default UserPage;
