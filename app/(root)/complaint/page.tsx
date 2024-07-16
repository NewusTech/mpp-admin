"use client";

import InputComponent from "@/components/InputComponent";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { fetcher } from "@/lib/fetch";
import useSWR from "swr";
import { DataTables } from "@/components/Datatables";
import { complaintColumns, manageApprovalColumns } from "@/constants";
import ProtectedRoute from "@/components/ProtectedRoute";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

export default function ComplaintPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
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
    `${process.env.NEXT_PUBLIC_API_URL}/user/pengaduan/get?limit=1000000&instansi_id=${instansiId}`,
    fetcher,
  );

  const result = data?.data;

  console.log(result);

  return (
    <ProtectedRoute roles={["Admin Instansi", "Staff Instansi"]}>
      <section className="mr-16">
        <div className="flex w-full items-center gap-x-2 justify-end mb-8">
          <div className="flex items-center gap-x-2 w-4/12">
            <InputComponent
              typeInput="datepicker"
              date={startDate}
              setDate={(e) => setStartDate(e)}
            />
            <p>to</p>
            <InputComponent
              typeInput="datepicker"
              date={endDate}
              setDate={(e) => setEndDate(e)}
            />
          </div>
        </div>
        {result && (
          <DataTables
            columns={complaintColumns}
            data={result}
            filterBy="judul"
          />
        )}
      </section>
    </ProtectedRoute>
  );
}
