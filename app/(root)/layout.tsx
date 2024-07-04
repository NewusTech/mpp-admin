"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import useAuthStore from "@/lib/store/useAuthStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <div className="flex h-screen flex-col">
      <Sidebar />
      <main className="md:pl-[350px] py-10 font-poppins">{children}</main>
    </div>
  );
}
