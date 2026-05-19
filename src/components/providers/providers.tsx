import { Suspense } from "react";
import { SidebarProvider } from "../ui/sidebar";
import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./theme-provider";
import Loader from "../ui/Loader";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryProvider>
        <Suspense fallback={<Loader />}>
          <AuthProvider>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
      </QueryProvider>
    </>
  );
};
