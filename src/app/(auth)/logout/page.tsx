"use client";

import React, { use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/store/authSlice";
import { logoutUser } from "@/helpers/client/user.auth";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";

const LogoutPage = () => {
  const { isLoggedIn } = useCurrentUser();
  const dispatch = useAppDispatch();
  const { data: logoutSuccess, isFetched } = useQuery({
    queryKey: ["logoutUser"],
    queryFn: logoutUser,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const router = useRouter()

  useEffect(() => {
    if (isFetched) {
      dispatch(logout());
    }
    if (!isLoggedIn) {
      router.push("/login");
       const message =  logoutSuccess ? "Logout successful" : "User already logged out";
      toast.success(message)
    }
  }, [isFetched, dispatch, isLoggedIn]);

  return <Loader />;
};

export default LogoutPage;
