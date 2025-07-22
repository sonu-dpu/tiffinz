"use client"
import Loader from "@/components/ui/Loader";
import { IAuthUser, refreshUserSession } from "@/helpers/client/user.auth";
import consumablePromise from "@/lib/consumablePromise";
import { login } from "@/store/authSlice";
import { useRouter } from "next/navigation";

import React, { use, useEffect} from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
const cachedPromise = consumablePromise<IAuthUser>(refreshUserSession);


function RefreshPage() {
  const {error, user} = use(cachedPromise);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(()=>{
    if(error){
        toast.dismiss();
        toast.error("Session expired", {description:"Login again"})
        router.push("/login");
    }else if(user){
        toast.dismiss();
        dispatch(login(user));
        router.push("/dashboard")
    }
  },[error, user, router, dispatch])
  return (
    <div className="h-screen w-full">
      <Loader />
    </div>
  );
}

export default RefreshPage;
