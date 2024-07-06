"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import useAuthStore from "@/lib/store/useAuthStore";
import { Loader } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false);
    }
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  console.log(isInitialized);

  return (
    <div className="flex h-screen flex-col">
      <Sidebar />
      <main className="md:pl-[350px] py-10 font-poppins">{children}</main>
    </div>
  );
}
