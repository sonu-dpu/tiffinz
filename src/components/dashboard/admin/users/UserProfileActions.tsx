"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Key } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import ResetPasswordLinkGenerator from "./ResetPasswordLinkGenerator";

function UserProfileActions() {
  return (
    <Card className="w-full max-w-md mx-auto mt-6 space-y-0 gap-0 py-0 overflow-hidden">
      <CardHeader className="font-medium p-4 ">
        <CardTitle>More Actions</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <Drawer direction="right">
          <DrawerTrigger variant={"ghost"} asChild>
            <Button
              variant={"ghost"}
              className="w-full flex justify-between rounded-none items-center px-6! py-4 "
            >
              <span className="flex justify-center items-center text-md gap-2 text-destructive">
                <Key className="w-4" /> Reset Password
              </span>
              <ChevronRight />
            </Button>
          </DrawerTrigger>

          <DrawerContent className="py-4">
            <DrawerHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DrawerHeader>
            <ResetPasswordDrawer />
          </DrawerContent>
        </Drawer>
        {/* <Separator /> */}
      </CardContent>
    </Card>
  );
}

function ResetPasswordDrawer() {
  const [isConfirmed, setConfirmed] = useState(false);
  const { id: userId } = useParams();
  if (isConfirmed) {
    return (
      <div className="p-2">
        <ResetPasswordLinkGenerator
          isConfirmed={isConfirmed}
          userId={userId as string}
        />
      </div>
    );
  }
  return (
    <div className="p-4 grid grid-rows-2 h-full">
      <div className="">
        <p className="text-muted-foreground">
          Are You Sure You want to reset Password For
        </p>
      </div>
      <div className="w-full h-full flex flex-col gap-4 mt-4 justify-end">
        <Button
          className="w-full"
          variant={"destructive"}
          onClick={() => setConfirmed(true)}
        >
          Yes, Reset
        </Button>
        <DrawerClose variant={"outline"}>Cancel</DrawerClose>
      </div>
    </div>
  );
}

export default UserProfileActions;
