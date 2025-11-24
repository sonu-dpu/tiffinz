import React from "react";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Description } from "@radix-ui/react-dialog";

type DialogWrapperProps = {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  trigger: boolean;
};

function DialogWrapper({
  children,
  open,
  onOpenChange,
  title="",
  trigger,
  ...props
}: DialogWrapperProps) {
  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
        }
      <DialogContent  aria-describedby={title}>
        <Description className="hidden">{title}</Description>
        <DialogTitle>{title}</DialogTitle>
        {children}
      </DialogContent>
      <DialogFooter>
        {/* You can add footer buttons here if needed */}
      </DialogFooter>
    </Dialog>
  );
}

export default DialogWrapper;
