"use client";

import * as React from "react";
const ThemeContext = React.createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}>({
  theme: "light",
  setTheme: () => {},
});
export const useTheme = () => React.useContext(ThemeContext);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState("light");
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("class", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
