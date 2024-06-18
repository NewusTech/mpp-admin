"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = Cookies.get("token");
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <div className="flex h-screen flex-col">
      <Sidebar />
      <main className="md:pl-[350px] py-10 font-poppins">{children}</main>
    </div>
  );
}
