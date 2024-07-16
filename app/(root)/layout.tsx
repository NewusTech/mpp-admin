"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import useAuthStore from "@/lib/store/useAuthStore";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initialize, isInitialized, user } = useAuthStore((state) => ({
    initialize: state.initialize,
    isInitialized: state.isInitialized,
    user: state.user,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [isInitialized, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Sidebar />
      <main className="md:pl-[350px] py-10 font-poppins">{children}</main>
    </div>
  );
}
