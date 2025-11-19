"use client"
import Loader from "@/components/ui/Loader";
import { refreshUserSession } from "@/helpers/client/user.auth";
import { login } from "@/store/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useEffect} from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";



function RefreshPage() {
  const {data:user, error, isFetching} = useQuery({
    queryKey: ["refreshUserSession"],
    queryFn: refreshUserSession,
    retry: false
  });
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      dispatch(login(user));
      router.push("/dashboard");
    } else if (error) {
      toast.error("Failed to refresh session: " + error.message);
      router.push("/login");
    }
  }, [user, error, dispatch, router, isFetching]);
  if(error){
    toast.error(error.message)
  }
  if (isFetching) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
}

export default RefreshPage;
