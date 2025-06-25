import React from "react";
import { Button } from "./button";

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
  return (
    <Button className={className}>{isLoading ? fallbackText : children}</Button>
  );
}
