import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />
      <main className="max-w-full w-full p-2">
        <SidebarTrigger />
        {children}
      </main>
    </>
  );
}

export default DashboardLayout;
