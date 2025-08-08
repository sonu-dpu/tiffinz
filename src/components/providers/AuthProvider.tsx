"use client";

import { getCurrentUser } from "@/helpers/client/user.auth";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/Loader";
import { useEffect } from "react";
import { setUser } from "@/store/authSlice";
import { usePathname, useRouter } from "next/navigation";

const publicRoutes = ["/", "/login", "/register", "/refresh-session", "/logout"]; // add your actual public routes
const validProtectedRoutes = [
  "/dashboard",
  "/dashboard/users",
  "/dashboard/add-balance",
  "/dashboard/account",
  "/dashboard/requests",
  "/dashboard/add-balance",
]; // add your actual valid protected routes

function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useAppSelector((state) =>state.auth.user);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = publicRoutes.includes(pathname);
  const isValidRoute =
    publicRoutes.some((route) => pathname === route) ||
    validProtectedRoutes.some((route) => pathname.startsWith(route));

  const {
    data: user,
    error,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: !currentUser,
  });

  useEffect(() => {
    if (user && !currentUser) {
      dispatch(setUser(user));
    }
  }, [user, currentUser, dispatch]);

  useEffect(() => {
    if (!isLoading && isFetched && !user && !currentUser && !isPublicRoute) {
      const safeRedirect = validProtectedRoutes.includes(pathname)
        ? pathname
        : "/dashboard";

      router.push(`/login?redirect=${safeRedirect}`);
    }
  }, [
    isLoading,
    currentUser,
    isPublicRoute,
    pathname,
    router,
    isFetched,
    user,
  ]);

  if (!isPublicRoute && !isValidRoute) {
    return <p>404 | Page not found</p>; // or use a custom 404 component
  }

  if (isLoading && !currentUser && !isPublicRoute) {
    return <Loader />;
  }

  if (error && !currentUser && !isPublicRoute) {
    return <p>{error.message}</p>;
  }

  return <>{children}</>;
}

export default AuthProvider;
