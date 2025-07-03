"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect } from "react";
import { useSessionExists } from "@/hooks/useSessionExists";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setUsers } from "@/store/usersSlice";
import { UserTable } from "@/components/dashboard/users/UserTable";
import { UserRole } from "@/constants/enum";
import { toast } from "sonner";
import { getUsers } from "@/helpers/client/admin.users";
import Loader from "@/components/ui/Loader";

export default function UsersPage() {
  const isSessionExists =  useSessionExists();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isSessionExists) {
        return;
      }
      console.log("fetching users from server");
      const {data, error} = await getUsers();
      // console.log("users", JSON.stringify(data));
      if(error) {
        console.error("Error fetching users:", error.message);
        toast.error(`Error fetching users: ${error.message}`);
        return;
      }
      dispatch(setUsers(data || []));
    };
    
    if (!users || users.length === 0) {
      if (currentUser && currentUser.role !== UserRole.admin) {
        console.error("Unauthorized access to users page");
        return;
      }else if(currentUser && currentUser.role === UserRole.admin) {
        console.log("fetching users");
        fetchUsers();
      }
    }
  }, [isSessionExists, dispatch, users, currentUser]);


  if(currentUser && currentUser.role !== UserRole.admin) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  if (!users) {
    return <Loader />;
  }
  return (
    <div className="container mx-auto py-10">
    {/* {console.count("render")} */}
      <DataTable columns={columns} data={users} />
      <UserTable
        users={users}
        onVerify={(users) => console.log("users", users)}
      />
    </div>
  );
}
