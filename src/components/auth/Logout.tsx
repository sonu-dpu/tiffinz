"use client";   
import React from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  //   DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { logoutUser } from "@/helpers/client/user.auth";
import { toast } from "sonner";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function LogoutButton() {
  // const { user, error } = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = async() => {
    toast.loading("Logging out...");
    const resp = await logoutUser();
    if(!resp){
    toast.dismiss();
      console.error("Logout failed");
      toast.error("Logout failed");
      return;
    }
    toast.dismiss();
    toast.success("Logged out successfully");
    dispatch(logout());
    router.push("/login");
  };
  return (
    <Drawer>
      <DrawerTrigger className="flex justify-center gap-2 border p-2"><LogOutIcon/>Logout </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure to logout?</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={handleLogout}>Logout</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default LogoutButton;
