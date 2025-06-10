import { UserRole } from "@/constants/enum";
import { NextResponse } from "next/server";

export function isAdmin(req: NextResponse) {
  const userRole = req.headers.get("x-user-role") || null;
  console.log("userRole", userRole);
  return userRole === UserRole.admin;
}


