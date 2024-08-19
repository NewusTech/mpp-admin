"use client";

import { dataAppsInstanceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const MasterApps = () => {
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);
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
          setInstansiId(decoded.instansi_id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/apkinstansi/get/${instansiId}`,
    fetcher,
  );

  const result = data?.data?.Apkinstansis;
  return (
    <ProtectedRoute roles={["Admin Instansi", "Admin Verifikasi"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <Link href="/master/master-apps-instance/create">
            <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
              Tambah
            </Button>
          </Link>
        </div>
        {result && (
          <DataTables
            columns={dataAppsInstanceColumns}
            data={result}
            filterBy="name"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default MasterApps;
