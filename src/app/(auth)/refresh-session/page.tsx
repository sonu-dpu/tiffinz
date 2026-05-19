"use client";
import Loader from "@/components/ui/Loader";
import { refreshUserSession } from "@/helpers/client/user.auth";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

function RefreshPage() {
  const { setUser } = useAuth();
  const {
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["refreshUserSession"],
    queryFn: refreshUserSession,
    retry: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  useEffect(() => {
    if (user) {
      setUser(user);
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
  }, [user, error, router, isFetching, redirectTo]);
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
