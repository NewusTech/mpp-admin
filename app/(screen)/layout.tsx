"use client";

import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import useAuthStore from "@/lib/store/useAuthStore";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function ScreenLayout({
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
    <div className={`${poppins.className} h-screen w-screen bg-primary-100`}>
      <div className="flex-1 overflow-y-auto">
        {children}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
