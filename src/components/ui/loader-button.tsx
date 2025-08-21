import React from "react";
import { Button, buttonVariants } from "./button";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";


export default function LoaderButton({
  isLoading = false,
  fallbackText = "",
  children,
  className = "",
  ...props
}: React.ComponentProps<"button"> &   VariantProps<typeof buttonVariants> & {
  isLoading: boolean;
  fallbackText: string;
  children: React.ReactNode;
  className?: string;
}) {
  const loading = (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      {fallbackText}
    </>
  );
  return (
    <Button className={className} disabled={isLoading} {...props}>
      {isLoading ? loading : children}
    </Button>
  );
}
