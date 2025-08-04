"use client";
import { SidebarProvider } from "../ui/sidebar";
import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import StoreProvider from "./storeProvider";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StoreProvider>
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </StoreProvider>
    </>
  );
};
