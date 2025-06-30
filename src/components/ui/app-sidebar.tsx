"use client"

import { BadgeIndianRupee, Home, PlusCircleIcon, Search, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/hooks/reduxHooks"
import Link from "next/link"
import { UserRole } from "@/constants/enum"



interface ISidebarItem {
  title: string
  url: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onlyForAdmin?: boolean
  onlyForUser?: boolean
}
// Menu items.

const sidebarItems: ISidebarItem[] =[
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Users",
    url: "/users",
    icon: User,
    onlyForAdmin: true, // Only for admin users
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: BadgeIndianRupee,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Search,
  },
  {
    title:"Add Balance",
    url: "/add-balance",
    icon: PlusCircleIcon,
    onlyForUser: true, // Only for regular users
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const currentUser = useAppSelector((state) => state.auth.user)
  const pathname = usePathname();
  const currentUserRole = currentUser?.role || UserRole.user; // Default to user role if not defined
  if(pathname === "/login" || pathname === "/register") {
    return null; // Don't render the sidebar on login or register pages.
  }
  
  return (
    <Sidebar>
      <SidebarHeader>Tiffinz</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                if(item.onlyForAdmin && currentUserRole !== UserRole.admin) {
                  return null; // Skip items that are only for admin users
                }
                if(item.onlyForUser && currentUserRole !== UserRole.user) {
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
              )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}