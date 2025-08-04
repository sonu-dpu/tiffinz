"use client";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setUsers } from "@/store/usersSlice";
import { UserTable } from "@/components/dashboard/admin/users/UserTable";
import { UserRole } from "@/constants/enum";
import { toast } from "sonner";
import { getUsers, verifyUser } from "@/helpers/client/admin.users";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";

export default function UsersPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const {data: usersData, error, isLoading} = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
    enabled: !users && currentUser?.role === UserRole.admin,
  });

  async function handleVerifyUser(userId: string) {
    const { data, error } = await verifyUser(userId);
    if (error) {
      console.log("error", error);
      toast.error("Failed to verify user");
    }
    console.log("data", data);
  }
  useEffect(() => {
    if(usersData && !users){
      dispatch(setUsers(usersData))
    }
  }, [dispatch, users, usersData, error]);

  if (currentUser && currentUser.role !== UserRole.admin) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }else if( error){
    return <div>{error?.message}</div>
  }else if(!users){
    return <div>Failed to fetch users</div>
  }
  return (
    <div className="container mx-auto py-10">
      {/* {console.count("render")} */}
      {/* <DataTable columns={columns} data={users} /> */}

      <UserTable
        users={users}
        onVerify={(user) => handleVerifyUser(String(user._id))}
      />
    </div>
  );
}
