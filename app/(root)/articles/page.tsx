"use client";

import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { newsColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useNewsStore from "@/lib/store/useNewsStore";
import ProtectedRoute from "@/components/ProtectedRoute";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const Articles = () => {
  const [instance, setInstance] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const setSelectedId = useNewsStore((state) => state.setSelectedId);

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

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/artikel/get?limit=10000000`;

  if (role === "Admin Instansi") {
    url += `&instansi_id=${instansiId}`;
  } else if ("Super Admin" && instance !== "") {
    url += `&instansi_id=${instanceId}`;
  }

  const { data: news } = useSWR<any>(url, fetcher);

  console.log(news);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const handlePassIdInstnace = (id: number) => {
    setSelectedId(id);
  };

  const result = data?.data;

  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Staff Instansi"]}>
      <section className="mr-16">
        <div
          className={`flex gap-x-6 ${role === "Admin Instansi" ? "justify-end mb-8" : "justify-between mb-[86px]"}`}
        >
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
          {instance || role === "Admin Instansi" ? (
            <Link href="/articles/create">
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
            <Link href="/articles/create">
              <Button
                onClick={() => handlePassIdInstnace(instansiId)}
                className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
              >
                Tambah
              </Button>
            </Link>
          )}
        </div>
        {news && (
          <DataTables
            columns={newsColumns}
            data={news?.data}
            filterBy="title"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default Articles;
