"use client";
import { useAuth } from "./useAuth";

export default function useCurrentUser() {
  const { user, isLoggedIn } = useAuth();
  const role = user?.role;
  return { user, isLoggedIn, userRole: role };
}