"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Optional utility for merging classNames
import {
  Home,
  User,
  CreditCard,
  Settings,
  List,
  Users,
  BarChart2,
  Receipt,
} from "lucide-react";
// import { UserRole } from "@/constants/enum";
import { useAppSelector } from "@/hooks/reduxHooks";
import { UserRole } from "@/constants/enum";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

// interface BottomNavProps {
//   role?: UserRole;
// }

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const userNav: NavItem[] = [
    { label: "Meals", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Account", icon: <User size={20} />, path: "/dashboard/account" },
    {
      label: "Add Balance",
      icon: <CreditCard size={20} />,
      path: "/dashboard/add-balance",
    },
    { label: "My Meals", icon: <List size={20} />, path: "/my-meals" },
    { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const adminNav: NavItem[] = [
    { label: "Home", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Users", icon: <Users size={20} />, path: "/dashboard/users" },
    { label: "Meals", icon: <List size={20} />, path: "/dashboard/meals" },
    {
      label: "Requests",
      icon: <Receipt size={20} />,
      path: "/dashboard/requests",
    },
    {
      label: "Analytics",
      icon: <BarChart2 size={20} />,
      path: "/dashboard/meals/add",
    },
    // {
    //   label: "Settings",
    //   icon: <Settings size={20} />,
    //   path: "/dashboard/settings",
    // },
  ];
  const currentUser = useAppSelector((state) => state.auth.user);
  const role = currentUser?.role;
  const isMobile = useIsMobile();
  const navItems = role === UserRole.admin ? adminNav : userNav;
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/"
  )
    return null;

  if (!isMobile) {
    return null;
  }
  return (
    <nav className="fixed bottom-0 z-50 w-full border-t bg-background shadow-sm">
      <ul className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li
              key={item.label}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex my-2 max-w-[60px] w-full p-1 flex-col items-center text-xs text-accent-foreground cursor-pointer transition-all border border-transparent rounded-md duration-150",
                isActive && " bg-primary/10 text-foreground rounded-lg"
              )}
            >
              {item.icon}
              <span className="text-[11px] mt-1 select-none">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
