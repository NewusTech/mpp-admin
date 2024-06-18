"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = Cookies.get("token");
  const router = useRouter();
  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, []);
  return <main className="font-poppins">{children}</main>;
}
