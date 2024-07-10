"use client";

import InputComponent from "@/components/InputComponent";
import { dataServiceColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import useServiceStore from "@/lib/store/useServiceStore";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const MasterService = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const router = useRouter();
  const setSelectedId = useServiceStore((state) => state.setSelectedId);

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

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get`;

  if (role === "Admin Instansi") {
    url += `/${instansiId}?limit=10000000`;
  } else if ("Super Admin") {
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

  const handlePassInstanceId = () => {
    if (role === "Admin Instansi" || role === "Staff Instansi") {
      setSelectedId(instansiId);
    } else {
      setSelectedId(instanceId);
    }
    router.push("/master/master-service/create");
  };

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Staff Instansi"]}>
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
          {instance || role === "Admin Instansi" ? (
            <Button
              onClick={handlePassInstanceId}
              className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
            >
              Tambah
            </Button>
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
            columns={dataServiceColumns}
            data={serviceAll}
            filterBy="name"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default MasterService;
