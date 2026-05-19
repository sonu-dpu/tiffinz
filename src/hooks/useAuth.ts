import { IUser } from "@/models/user.model";
import { createContext, useContext } from "react";

export type AuthContextProps = {
  user: IUser | null;
  isLoggedIn: boolean;
  setUser: (user: IUser | null) => void;
};
export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("Use useAuth inside AuthProvider");
  }
  return ctx;
};
