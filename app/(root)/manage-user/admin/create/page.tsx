"use client";

import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminData from "@/components/Form/Admin";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const CreateAdminData = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<any>(token);
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
    <ProtectedRoute roles={["Super Admin", "Admin Instansi"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/manage-user/admin">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="-mt-[78px]">
          <h1 className="text-2xl text-primary-700 font-bold">Tambah Admin</h1>
          <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
            <h1 className="text-xl font-semibold mb-4">Data Diri</h1>
            <AdminData role={role} />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateAdminData;
