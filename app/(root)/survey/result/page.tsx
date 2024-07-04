"use client";

import InputComponent from "@/components/InputComponent";
import { surveyResultColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const SurveyResult = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input

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

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey`;

  if (role === "Admin Instansi") {
    url += `?instansi_id=${instansiId}&limit=1000000`;
  } else if ("Superadmin") {
    url += `?instansi_id=${instanceId}&limit=1000000`;
  }

  const { data: resultSurvey } = useSWR<any>(url, fetcher);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const surveys = resultSurvey?.data;

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Staff Instansi"]}>
      <section className="mr-16">
        <div className="flex justify-between mb-8">
          <div className="w-1/2">
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
        </div>
        {surveys && (
          <DataTables
            columns={surveyResultColumns}
            data={surveys}
            filterBy="layanan_name"
            type="requirement"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default SurveyResult;
