"use client";
import BottomNav from "@/components/navbar/BottomNav";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppSelector } from "@/hooks/reduxHooks";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = useAppSelector((state) => state.auth.user);
  return (
    <>
      <AppSidebar currentUserRole={currentUser?.role} />
      <main className="max-w-full w-full p-2 mx-auto">
        <SidebarTrigger />
        <div className="container mx-auto">{children}</div>
      </main>
      {currentUser && <BottomNav role={currentUser?.role} />}
    </>
  );
}

export default DashboardLayout;
