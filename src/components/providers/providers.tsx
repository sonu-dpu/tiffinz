"use client";
import { SidebarProvider } from "../ui/sidebar";
import StoreProvider from "./storeProvider";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StoreProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </StoreProvider>
    </>
  );
};
