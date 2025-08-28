"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/store/authSlice";
import { logoutUser } from "@/helpers/client/user.auth";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { redirect } from "next/navigation";

const LogoutPage = () => {
  const dispatch = useAppDispatch();
  const { data: logoutSuccess, isFetched } = useQuery({
    queryKey: ["logoutUser"],
    queryFn: logoutUser,
    refetchOnWindowFocus: false,
    retry: false,
  });


  useEffect(() => {
    dispatch(logout());
    if (isFetched) {
      const message =  logoutSuccess ? "Logout successful" : "User already logged out";
      toast.success(message)
      redirect("/login")
    }
  }, [isFetched, logoutSuccess, dispatch]);

  return <Loader />;
};

export default LogoutPage;
