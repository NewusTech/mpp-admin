"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ReportTab from "@/components/Report";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const ReportDetail = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);

        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role && decoded.instansi_id !== undefined) {
          setRole(decoded.role);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  return (
    <ProtectedRoute
      roles={[
        "Admin Instansi",
        "Super Admin",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        <ReportTab serviceId={params.id} role={role} />
      </section>
    </ProtectedRoute>
  );
};

export default ReportDetail;
