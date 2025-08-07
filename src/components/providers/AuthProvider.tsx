"use client";

import { getCurrentUser } from "@/helpers/client/user.auth";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/Loader";
import { useEffect } from "react";
import { setUser } from "@/store/authSlice";
import { usePathname, useRouter } from "next/navigation";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const router = useRouter()
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    // enabled: !currentUser
  });

  useEffect(() => {
    if (user && !currentUser) {
      dispatch(setUser(user));
    }
  }, [user, error, currentUser, dispatch, isPublicRoute]);

  useEffect(()=>{
    if(!isLoading && !currentUser){
      router.push(`/login?redirect=${pathname}`)
    }
  },[currentUser, user, router, isLoading, pathname])

  if (error && !isPublicRoute) {
    return <p>{error.message}</p>;
  }

  if (isLoading && !currentUser && !isPublicRoute) {
    return <Loader />;
  }

  return <>{children}</>;
}

export default AuthProvider;
