"use client";

import { CustomProvider, Nav } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import AuthClientWrapper from "../_contexts/authClientWrapper";
import SiderbarComponent from "./_components/sidebar";
import NavbarComponet from "./_components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen justify-between">
          {/* <header className="bg-red-800">teste</header> */}
          <main className={`${geistSans.variable} ${geistMono.variable}`}>
            <div className="flex mx-auto h-screen">
              <AuthClientWrapper>
                {!isLoginPage && (
                  <div className="flex flex-col w-full max-h-full">
                    <NavbarComponet />
                    <div className="flex flex-row flex-1 overflow-hidden">
                      <SiderbarComponent />
                      <div className="flex-auto overflow-auto">{children}</div>
                    </div>
                  </div>
                )}
                {isLoginPage && <div className="w-full">{children}</div>}
              </AuthClientWrapper>
            </div>
          </main>
          {/* <footer className="bg-red-800">teste</footer> */}
        </div>
      </body>
    </html>
  );
}
