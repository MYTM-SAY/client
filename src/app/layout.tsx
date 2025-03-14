import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/SideBar/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import NavBar from "@/components/NavBar/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Providers>
            <SignedIn>
              <SidebarProvider>
                <main className="flex w-full h-screen overflow-hidden">
                  <AppSidebar />
                  <SidebarTrigger />
                  <div className="ml-2 flex-col flex flex-1 overflow-auto no-scrollbar">
                    <NavBar />
                    {children}
                  </div>
                </main>
              </SidebarProvider>
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </Providers>
          <Toaster />
      </body>
    </html>
  );
}
