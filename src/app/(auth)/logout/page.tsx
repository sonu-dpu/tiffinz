"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/store/authSlice";
import { logoutUser } from "@/helpers/client/user.auth";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { redirect } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";

const LogoutPage = () => {
  const { isLoggedIn } = useCurrentUser();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLoggedIn) {
      logoutUser()
        .then(() => {
          dispatch(logout());
          toast.success("Logged out successfully");
        })
        .catch((error) => {
          toast.error("Failed to logout: " + error.message);
        })
        .finally(() => {
          queryClient.clear();
        });
    } else {
      redirect("/login?loggedOut=true");
    }
  }, [isLoggedIn, dispatch, queryClient]);

  return <Loader />;
};

export default LogoutPage;
