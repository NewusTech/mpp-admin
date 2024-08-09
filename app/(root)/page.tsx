"use client";

import DashboardSuperadmin from "@/components/Dashboard/Superadmin";
import InstanceDashboard from "@/components/Dashboard/Instance";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DashboardBupati from "@/components/Dashboard/Bupati";
import ProtectedRoute from "@/components/ProtectedRoute";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);
        console.log(decoded);

        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role && decoded.instansi_id !== undefined) {
          setRole(decoded.role);
          setInstansiId(decoded.instansi_id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <ProtectedRoute
      roles={[
        "Super Admin",
        "Admin Instansi",
        "Bupati",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        {role === "Bupati" ? (
          <DashboardBupati />
        ) : role === "Admin Instansi" ||
          role === "Admin Layanan" ||
          role === "Admin Verifikasi" ? (
          <InstanceDashboard />
        ) : (
          <DashboardSuperadmin />
        )}
      </section>
    </ProtectedRoute>
  );
}
