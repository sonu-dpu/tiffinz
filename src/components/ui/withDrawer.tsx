"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  //   DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type WithDrawerProps = {
  title?: string;
  children: React.ReactNode;
  drawerTriggerText: string;
  drawerTriggerIcon: React.ReactElement;
};
function WithDrawer({
  children,
  title = "",
  drawerTriggerIcon,
  drawerTriggerText,
}: WithDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger
        variant={"default"}
        className="flex justify-center gap-2 border p-2 "
      >
        {drawerTriggerIcon}
        {drawerTriggerText}
      </DrawerTrigger>

      <DrawerContent aria-describedby="logout-drawer">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <div>{children}</div>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        {/* <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}

export default WithDrawer;
