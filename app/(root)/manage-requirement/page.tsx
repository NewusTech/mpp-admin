"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { manageRequirementColumns } from "@/constants";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import useCreateRequirement from "@/lib/store/useCreateRequirement";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  permission: string[];
}

const ManageRequirements = () => {
  const [instance, setInstance] = useState<string>("");
  const setSelectedId = useCreateRequirement((state) => state.setSelectedId);
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const [permission, setPermission] = useState<string[]>([]);

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
          setPermission(decoded.permission);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handlePassIdInstnace = (id: number) => {
    setSelectedId(id);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const instanceId = Number(instance);

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get`;

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    url += `/${instansiId}?limit=10000000`;
  } else {
    url += `/${instanceId}?limit=10000000`;
  }

  const { data: services } = useSWR<any>(url, fetcher);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const serviceAll = services?.data;

  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Admin Layanan"]}>
      <section className="mr-16">
        <div>
          <h1 className="text-lg font-semibold">Kelola Persyaratan</h1>
          <div className="flex justify-between mt-4">
            <div className="w-1/2">
              {role !== "Admin Instansi" && role !== "Admin Layanan" && (
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
            {instance || role === "Admin Instansi" ? (
              <Link href="/manage-requirement/create">
                <Button
                  onClick={() =>
                    role === "Admin Instansi" || role === "Admin Layanan"
                      ? handlePassIdInstnace(instansiId)
                      : handlePassIdInstnace(instanceId)
                  }
                  className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
                >
                  Tambah
                </Button>
              </Link>
            ) : permission.includes("Buat Permohonan") ? (
              ""
            ) : (
              <Button
                disabled={true}
                className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
              >
                Tambah
              </Button>
            )}
          </div>
          {serviceAll && (
            <DataTables
              columns={manageRequirementColumns}
              data={serviceAll}
              filterBy="name"
              type="requirement"
            />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default ManageRequirements;
