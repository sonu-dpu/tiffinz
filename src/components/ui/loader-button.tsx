import React from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

export default function LoaderButton({
  isLoading = false,
  fallbackText = "",
  children,
  className = "",
}: {
  isLoading: boolean;
  fallbackText: string;
  children: React.ReactNode;
  className?: string;
}) {
  const loading = (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {fallbackText}
    </>
  );
  return (
    <Button className={className} disabled={isLoading}>
      {isLoading ? loading : children}
    </Button>
  );
}
