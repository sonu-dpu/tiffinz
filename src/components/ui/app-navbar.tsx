import { cn } from "@/lib/utils";
import React from "react";
export interface INavbarItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onlyForAdmin?: boolean;
  onlyForUser?: boolean;
}

interface IAppNavbarProps {
  position: "bottom" | "top" | "left" | "right";
  navbarItems: INavbarItem[];
}

function AppNavbar({ position = "bottom", navbarItems }: IAppNavbarProps) {
  const styles =
    position === "bottom" || position === "top"
      ? "w-full border left-0 right-0 p-2 flex"
      : "max-w-full";
  return (
    <nav className={cn(` justify-center ${styles} ${position}-0`)}>

        {navbarItems.map((item) => (
          <li className="list-none inline" key={item.title}>
        
              <item.icon/>
              {item.title}
          </li>
        ))}

    </nav>
  );
}

export default AppNavbar;
