"use client";

import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { surveyQuestionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import useCreateSurvey from "@/lib/store/useCreateSurvey";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const SurveyQuestion = () => {
  const [instance, setInstance] = useState<string>("");
  const setSelectedId = useCreateSurvey((state) => state.setSelectedId);
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number>(0);
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

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/survey/form`;

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    url += `/${instansiId}?limit=10000000`;
  } else {
    url += `/${instanceId}?limit=10000000`;
  }

  const { data: surveys } = useSWR<any>(url, fetcher);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const surveyAll = surveys?.data?.Surveyforms;

  const handlePassIdInstnace = (id: number) => {
    setSelectedId(id);
  };

  return (
    <ProtectedRoute
      roles={["Super Admin", "Admin Instansi", "Admin Verifikasi"]}
    >
      <section className="mr-16">
        <div className="flex justify-between mb-8">
          <div className="w-1/2">
            {role !== "Admin Isntansi" && role !== "Admin Layanan" && (
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
            <Link href="/survey/question/create">
              <Button
                onClick={() =>
                  role === "Admin Instansi"
                    ? handlePassIdInstnace(instansiId)
                    : handlePassIdInstnace(instanceId)
                }
                className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
              >
                Tambah
              </Button>
            </Link>
          ) : (
            <Button
              disabled={true}
              className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
            >
              Tambah
            </Button>
          )}
        </div>
        {surveyAll && (
          <DataTables
            columns={surveyQuestionColumns}
            data={surveyAll}
            filterBy="field"
            type="requirement"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default SurveyQuestion;
