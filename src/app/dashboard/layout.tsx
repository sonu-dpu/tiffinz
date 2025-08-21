"use client";
import BottomNav from "@/components/navbar/BottomNav";
// import Navbar from "@/components/navbar/TopNav";
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
      <div className="w-full">
        {/* <Navbar /> */}
        <SidebarTrigger/>
        <main className="max-w-full w-full mx-auto">
          <div className="container mx-auto px-2">{children}</div>
        </main>
      </div>
      {currentUser && <BottomNav role={currentUser?.role} />}
    </>
  );
}

export default DashboardLayout;
