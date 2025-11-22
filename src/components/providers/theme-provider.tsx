"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}>({
  theme: "system",
  setTheme: () => {},
});
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(()=>localStorage.getItem("theme") || "system");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    console.log('savedTheme from local store', savedTheme)
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("class", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () =>{
  const context = useContext(ThemeContext)
  if(!context){
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}