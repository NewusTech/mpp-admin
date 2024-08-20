"use client";

import { sopInstanceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateSOPInstance from "@/app/(root)/master/sop-instance/DialogForm";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const MasterSOPMPP = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);
  const [searchInputInstance, setSearchInputInstance] = useState("");

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

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/sopinstansi/get`;

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    url += `/${instansiId}?limit=10000000`;
  } else {
    url += `/${instanceId}?limit=10000000`;
  }

  let instanceId2;

  if (
    role === "Admin Instansi" ||
    role === "Admin Layanan" ||
    role === "Admin Verifikasi"
  ) {
    instanceId2 = instansiId;
  } else {
    instanceId2 = instanceId;
  }

  const { data: sop } = useSWR<any>(url, fetcher);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const sopAll = sop?.data?.Sopinstansis;

  return (
    <ProtectedRoute
      roles={[
        "Super Admin",
        "Admin Instansi",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        <div
          className={`flex gap-x-6 ${role === "Admin Instansi" ? "justify-end mb-8" : "justify-between mb-[86px]"}`}
        >
          <div className="w-full">
            {role !== "Admin Instansi" && (
              <InputComponent
                typeInput="selectSearch"
                valueInput={searchInputInstance}
                onChangeInputSearch={(e) =>
                  setSearchInputInstance(e.target.value)
                }
                items={result}
                label="Instansi"
                placeholder="Pilih Instansi"
                value={instance}
                onChange={(e: any) => setInstance(e)}
              />
            )}
          </div>
          {instance ||
          role === "Admin Instansi" ||
          role === "Admin Layanan" ||
          role === "Admin Verifikasi" ? (
            <AlertDialogCreateSOPInstance id={instanceId2} />
          ) : (
            <Button
              disabled={true}
              className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
            >
              Tambah
            </Button>
          )}
        </div>
        {sopAll && (
          <DataTables
            columns={sopInstanceColumns}
            data={sopAll}
            filterBy="file"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default MasterSOPMPP;
