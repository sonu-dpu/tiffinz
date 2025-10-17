
import { SidebarTrigger } from "@/components/ui/sidebar";


function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <>
      {/* <AppSidebar currentUserRole={currentUser?.role} /> */}
      <div className="w-full">
        <SidebarTrigger/>
        <main className="max-w-full w-full mx-auto pt-10 pb-10">
          <div className="container mx-auto px-2 pb-10">{children}</div>
        </main>
      </div>
  
    </>
  );
}

export default DashboardLayout;
