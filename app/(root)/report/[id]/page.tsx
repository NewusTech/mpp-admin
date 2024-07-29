"use client";

import InputComponent from "@/components/InputComponent";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReportTab from "@/components/Report";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  layanan_id: number;
}

const ReportDetail = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const [searchInputService, setSearchInputService] = useState(""); // State for search input

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
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const instanceId = Number(instance);

  let instanceId2;

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    instanceId2 = instansiId;
  } else {
    instanceId2 = instanceId;
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance, searchInputService]);

  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Admin Layanan"]}>
      <section className="mr-16">
        <ReportTab serviceId={params.id} instanceId={instanceId2} />
      </section>
    </ProtectedRoute>
  );
};

export default ReportDetail;
