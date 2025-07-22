"use client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser, IAuthUser } from "@/helpers/client/user.auth";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import consumablePromise from "@/lib/consumablePromise";
import { login } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { toast } from "sonner";

const cachedCurrentUser = consumablePromise<IAuthUser>(getCurrentUser);
function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch()
  const router = useRouter();

  // Declare variables that might be assigned conditionally
  let user=null, error=null;

  // Conditionally fetch user and assign to the outer-scoped variables
  if (!currentUser) {
    const result = use(cachedCurrentUser);
    user = result.user;
    error = result.error;
  }

  useEffect(() => {
    if(user){
      dispatch(login(user))
    }
    if (error) {
      toast.message("Session expired", { description: "Refreshing session" });
      router.push("/refresh-session");
    }
  }, [error, router, user, dispatch]);
  return (
    <>
      <AppSidebar />
      <main className="max-w-full w-full p-2 mx-auto">
        <SidebarTrigger />
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  );
}

export default DashboardLayout;
