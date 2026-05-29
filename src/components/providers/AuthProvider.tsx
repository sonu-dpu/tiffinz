"use client";

import { getCurrentUser, refreshUserSession } from "@/helpers/client/user.auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../ui/Loader";
import { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthContext } from "@/hooks/useAuth";
import { IUser } from "@/models/user.model";
import NotFound from "@/app/not-found";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/refresh-session",
  "/logout",
  "/reset-password",
]; // add your actual public routes
const validProtectedRoutes = [
  "/dashboard",
  "/dashboard/users",
  "/dashboard/add-balance",
  "/dashboard/account",
  "/dashboard/requests",
  "/dashboard/add-balance",
];
const CURRENT_USERQUERY_KEY = "currentUser";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRedirectedAfterLogout = searchParams.get("loggedOut") === "true";
  const isPublicRoute = publicRoutes.includes(pathname);
  const isValidRoute =
    publicRoutes.some((route) => pathname === route) ||
    validProtectedRoutes.some((route) => pathname.startsWith(route));
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: [CURRENT_USERQUERY_KEY],
    queryFn: getCurrentUserOrRefresh,
    retry: false,
    enabled: !isPublicRoute && !isRedirectedAfterLogout,
  });

  useEffect(() => {
    if (!isLoading && isFetched && !user && !isPublicRoute) {
      const safeRedirect = validProtectedRoutes.find((value) =>
        value.startsWith(pathname),
      )
        ? pathname
        : "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(safeRedirect)}`);
    }
  }, [isLoading, isPublicRoute, pathname, router, isFetched, user]);

  if (!isPublicRoute && !isValidRoute) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error && !isPublicRoute) {
    toast.error(error.message);
    return null;
  }

  const setUser = (newUser: IUser | null) => {
    queryClient.setQueryData([CURRENT_USERQUERY_KEY], newUser);
  };

  return (
    <AuthContext.Provider
      value={{ user: user!, isLoggedIn: Boolean(user), setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

async function getCurrentUserOrRefresh() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    const refreshResponse = await refreshUserSession();
    if (refreshResponse) {
      return refreshResponse;
    }
    throw error;
  }
}
export default AuthProvider;
