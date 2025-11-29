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
import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";


function LogoutButton() {
  return (
    <Drawer>
      <DrawerTrigger className="flex justify-center gap-2 border p-2 w-full">
        <LogOutIcon />
        Logout{" "}
      </DrawerTrigger>
      <DrawerContent aria-describedby="logout-drawer">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure to logout?</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose onClick={()=>redirect("/logout")}>Logout</DrawerClose>
          <DrawerClose variant={"outline"}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default LogoutButton;
