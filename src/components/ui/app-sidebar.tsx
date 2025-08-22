"use client";
import {
  BadgeIndianRupee,
  Home,
  PlusCircleIcon,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/constants/enum";
import LogoutButton from "../auth/Logout";
import { useAppSelector } from "@/hooks/reduxHooks";

interface ISidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onlyForAdmin?: boolean;
  onlyForUser?: boolean;
}
// Menu items.

const sidebarItems: ISidebarItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
    onlyForAdmin: true, // Only for admin users
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: BadgeIndianRupee,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Search,
  },
  {
    title: "Add Balance",
    url: "/dashboard/add-balance",
    icon: PlusCircleIcon,
    onlyForUser: true, // Only for regular users
  },
  {
    title: "Add Balance Request",
    url: "/dashboard/requests",
    icon: PlusCircleIcon,
    onlyForAdmin: true,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  // console.log('currentUser', currentUser);
  const currentUserRole = useAppSelector((state)=>state.auth.user?.role)

  if (!pathname.startsWith("/dashboard")) {
    return null; // Don't render the sidebar on login or register pages.
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>Tiffinz</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                if (item.onlyForAdmin && currentUserRole !== UserRole.admin) {
                  return null; // Skip items that are only for admin users
                }
                if (item.onlyForUser && currentUserRole !== UserRole.user) {
                  return null; // Skip items that are only for regular users
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
