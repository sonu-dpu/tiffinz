import { getCurrentUser } from "@/helpers/client/user.auth";
import React from "react";
import { useAppDispatch } from "./reduxHooks";

export function useSessionExists() {
  const [sessionExists, setSessionExists] = React.useState<boolean | null>(
    null
  );
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const checkSession = async () => {
      const { user, error } = await getCurrentUser();
      if (error) {
        console.error("Error fetching current user:", error);
        setSessionExists(false);
        dispatch({ type: "auth/logout" });
      } else if (user) {
        // console.log("Current user:", user);
        setSessionExists(true);
        dispatch({ type: "auth/login", payload: user });
      }
    };

    checkSession();
    return () => {
      setSessionExists(null); // Reset state on unmount
    };
  }, [dispatch]);

  return sessionExists;
}
