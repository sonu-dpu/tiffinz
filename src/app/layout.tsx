import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import InstallPrompt from "@/components/ui/pwa-install-button";
import { AppSidebar } from "@/components/ui/app-sidebar";
// import { UserRole } from "@/constants/enum";
import BottomNav from "@/components/navbar/BottomNav";
import Navbar from "@/components/navbar/TopNav";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiffinz",
  description: "Your daily meal companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased bg-background`}
      >
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
        <InstallPrompt />
      </body>
    </html>
  );
}
