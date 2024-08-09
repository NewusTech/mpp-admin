"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { manageApprovalColumns } from "@/constants";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";
import ManageApproval from "@/components/ManageApproval";
import { useSearchParams } from "next/navigation";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  layanan_id: number;
}

const ManageApprovals = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [layananId, setLayananId] = useState<number | null>(null);

  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const [searchTermService, setSearchTermService] = useState("");
  const [searchInputService, setSearchInputService] = useState(""); // State for search input
  const queryParams = useSearchParams().get("tabs");

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
          setLayananId(decoded.layanan_id);
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

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    url += `/${instansiId}?search=${searchTermService}`;
  } else {
    url += `/${instanceId}?search=${searchTermService}`;
  }

  const { data: services } = useSWR(url, fetcher);

  const serviceId = Number(service);

  let instanceId2;
  let serviceId2;

  if (role === "Admin Instansi" || role === "Admin Layanan" || role === "Admin Verifikasi") {
    instanceId2 = instansiId;
  } else {
    instanceId2 = instanceId;
  }

  if (role === "Admin Layanan") {
    serviceId2 = layananId;
  } else {
    serviceId2 = serviceId;
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
      setSearchTermService(searchInputService);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance, searchInputService]);

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
        <div className="flex justify-between gap-x-5 mb-8">
          <div className="flex w-full gap-x-5">
            {role !== "Admin Instansi" &&
              role !== "Admin Layanan" &&
              role !== "Admin Verifikasi" && (
                <InputComponent
                  typeInput="selectSearch"
                  valueInput={searchInputInstance}
                  onChangeInputSearch={(e) =>
                    setSearchInputInstance(e.target.value)
                  }
                  items={data?.data}
                  label="Instansi"
                  placeholder="Pilih Instansi"
                  value={instance}
                  onChange={(e: any) => setInstance(e)}
                />
              )}
            {role !== "Admin Layanan" && (
              <InputComponent
                typeInput="selectSearch"
                items={services?.data}
                valueInput={searchInputService}
                onChangeInputSearch={(e) =>
                  setSearchInputService(e.target.value)
                }
                label="Layanan"
                placeholder="Pilih Layanan"
                value={service}
                onChange={(e: any) => setService(e)}
              />
            )}
          </div>
        </div>
        <ManageApproval
          serviceId={serviceId2}
          instanceId={instanceId2}
          queryParams={queryParams}
          role={role}
        />
      </section>
    </ProtectedRoute>
  );
};

export default ManageApprovals;
