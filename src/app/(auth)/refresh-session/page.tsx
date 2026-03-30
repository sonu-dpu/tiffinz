"use client";
import Loader from "@/components/ui/Loader";
import { refreshUserSession } from "@/helpers/client/user.auth";
import { login } from "@/store/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function RefreshPage() {
  const {
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["refreshUserSession"],
    queryFn: refreshUserSession,
    retry: false,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  useEffect(() => {
    if (user) {
      dispatch(login(user));
      router.replace(`${decodeURIComponent(redirectTo)}`);
    } else if (error) {
      toast.error("Failed to refresh session: " + error.message);
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }

    if (isFetching) {
      toast.loading("Refreshing session...");
    }
    return () => {
      toast.dismiss();
    };
  }, [user, error, dispatch, router, isFetching, redirectTo]);
  if (error) {
    toast.error(error.message);
  }

  return (
    <div className="flex items-center justify-center max-h-dvh w-full">
      <Loader />
    </div>
  );
}

export default RefreshPage;
