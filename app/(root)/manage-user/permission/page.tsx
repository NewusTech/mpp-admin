"use client";

import { managePermissionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import ProtectedRoute from "@/components/ProtectedRoute";
import InputComponent from "@/components/InputComponent";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const ManagePermission = () => {
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

  const { data: instances } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const instanceId = Number(instance);

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/alluserinfo/get?limit=1000000&`;

  if (role === "Admin Instansi") {
    url += `instansi=${instansiId}`;
  } else {
    url += `instansi=${instanceId}`;
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const { data } = useSWR<any>(url, fetcher);

  const result = data?.data;
  console.log(result);

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Layanan", "Admin Instansi"]}>
      <section className="mr-16">
        <div className="flex justify-between mt-4">
          <div className="w-1/2">
            <InputComponent
              typeInput="selectSearch"
              valueInput={searchInputInstance}
              onChangeInputSearch={(e) =>
                setSearchInputInstance(e.target.value)
              }
              items={instances?.data}
              label="Instansi"
              placeholder="Pilih Instansi"
              value={instance}
              onChange={(e: any) => setInstance(e)}
            />
          </div>
        </div>
        {result && (
          <DataTables
            columns={managePermissionColumns}
            data={result}
            filterBy="name"
            type="request"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default ManagePermission;
