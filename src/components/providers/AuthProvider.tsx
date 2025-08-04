"use client";
import { getCurrentUser } from "@/helpers/client/user.auth";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/Loader";
import { useEffect } from "react";
import { setUser } from "@/store/authSlice";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { data:user, error, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
    useEffect(() => {
    if (user && !currentUser) {
      dispatch(setUser(user))
    }
    if (error && currentUser) {
      alert(error.message)
    }
  }, [user, error, currentUser, dispatch])
  if(error){
    return <div>{error.message}</div>
  }
  if(isLoading){
    return <Loader/>
  }
  return <>{children}</>;
}

export default AuthProvider;
