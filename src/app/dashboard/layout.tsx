import BottomNav from "@/components/navbar/BottomNav";
import Navbar from "@/components/navbar/TopNav";
import { AppSidebar } from "@/components/ui/app-sidebar";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />
      <div className="max-w-full w-full relative">
        <Navbar />
        {/* <SidebarTrigger/> */}
        <main className="max-w-full w-full mx-auto pt-16 md:pt-2 pb-10">
          <div className="container mx-auto px-2 pb-10">{children}</div>
        </main>
      </div>
      <BottomNav />
    </>
  );
}

export default DashboardLayout;
