"use client";
import React from "react";
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    toast.loading("Logging out...");
    const resp = await logoutUser();
    if (!resp) {
      toast.dismiss();
      console.error("Logout failed");
      toast.error("Logout failed");
      return;
    }
    toast.dismiss();
    toast.success("Logged out successfully");
    dispatch(logout());
    router.push("/login")
    
  };

  return (
    <Drawer>
      <DrawerTrigger className="flex justify-center gap-2 border p-2">
        <LogOutIcon />
        Logout{" "}
      </DrawerTrigger>
      <DrawerContent aria-describedby="logout-drawer">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure to logout?</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose onClick={handleLogout}>Logout</DrawerClose>
          <DrawerClose variant={"outline"}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default LogoutButton;
