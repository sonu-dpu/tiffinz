"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setUsers } from "@/store/usersSlice";
import { UserRole } from "@/constants/enum";
import { toast } from "sonner";
import { getUsers, verifyUser } from "@/helpers/client/admin.users";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { UserTableDesktop } from "@/components/dashboard/admin/users/UserTableDesktop";
import { UserCardListMobile } from "@/components/dashboard/admin/users/UserCardListMobile";


export default function UsersPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const { data: usersData, error, isLoading } = useQuery({
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
    if (data) {
      toast.success("User verified successfully");
    }
  }

  useEffect(() => {
    if (usersData && !users) {
      dispatch(setUsers(usersData));
    }
  }, [dispatch, users, usersData, error]);

  const [search, setSearch] = useState("");
  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users || [];
    return (users || []).filter(
      (user) =>
        user.username?.toLowerCase().includes(s) ||
        user._id?.toString().toLowerCase().includes(s) ||
        user.email?.toLowerCase().includes(s) ||
        user.phone?.toLowerCase().includes(s)
    );
  }, [users, search]);

  // --- Role Protection ---
  if (currentUser && currentUser.role !== UserRole.admin) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // --- Loading & Error states ---
  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return <div>{error?.message}</div>;
  } else if (!users) {
    return <div>Failed to fetch users</div>;
  }

  // --- Main Render ---
  return (
    <div className="container mx-auto py-10">
      {/* Search Bar */}
      <div className="mb-4 flex">
        <Input
          type="text"
          placeholder="Search by username, id, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <UserTableDesktop
        users={filteredUsers}
        onVerify={(user) => handleVerifyUser(String(user._id))}
      />

      {/* Mobile Cards */}
      <UserCardListMobile
        users={filteredUsers}
        onVerify={(user) => handleVerifyUser(String(user._id))}
      />

      {/* No Users */}
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 py-8">No users found.</div>
      )}
    </div>
  );
}
