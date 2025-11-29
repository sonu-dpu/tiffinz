"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../ui/theme-toggle";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // You can map route => title here
  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/tiffins": "My Tiffins",
    "/balance": "Balance",
    "/orders": "Orders",
    "/settings": "Settings",
  };

  const title = titles[pathname] || "Tiffinz";

  const isRootPage = pathname.startsWith("/dashboard");
  if(!isRootPage) return null
  return (
    <header className="bg-background z-50  border-b fixed md:sticky top-0 left-0 right-0">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side: Back or Menu */}
        {isRootPage ? (
          <SidebarTrigger />
        ) : (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Center: Page Title */}
        <h1 className="text-lg font-semibold">{title}</h1>

        {/* Right Side: Empty placeholder for balance, profile, etc. */}
        <div className="w-8">
          <ModeToggle/>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
