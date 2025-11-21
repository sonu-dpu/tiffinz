import { SidebarProvider } from "../ui/sidebar";
import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import StoreProvider from "./storeProvider";
import { ThemeProvider } from "./theme-provider";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StoreProvider>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              // disableTransitionOnChange
            >
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </StoreProvider>
    </>
  );
};
