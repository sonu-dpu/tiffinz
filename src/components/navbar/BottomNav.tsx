"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Optional utility for merging classNames
import { Home, User, CreditCard, Settings, List, Users, BarChart2, Receipt } from "lucide-react";
import { UserRole } from "@/constants/enum";


interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface BottomNavProps {
  role: UserRole;
}

export default function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userNav: NavItem[] = [
    { label: "Meals", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Account", icon: <User size={20} />, path: "/dashboard/account" },
    { label: "Add Balance", icon: <CreditCard size={20} />, path: "/dashboard/add-balance" },
    { label: "My Meals", icon: <List size={20} />, path: "/my-meals" },
    { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const adminNav: NavItem[] = [
    { label: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { label: "Meals", icon: <List size={20} />, path: "/admin/meals" },
    { label: "Requests", icon: <Receipt size={20} />, path: "/admin/requests" },
    { label: "Analytics", icon: <BarChart2 size={20} />, path: "/admin/analytics" },
    { label: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const navItems = role === "ADMIN" ? adminNav : userNav;

  return (
    <nav  className="fixed bottom-0 z-50 w-full border-t bg-white shadow-sm ">
      <ul className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li
              key={item.label}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center text-xs text-gray-500 cursor-pointer transition-all",
                isActive && "text-blue-600 font-medium"
              )}
            >
              {item.icon}
              <span className="text-[11px] mt-1">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
