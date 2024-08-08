"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import { Report as Reports } from "@/types/type";
import { reportColumns } from "@/constants";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const Report = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const now = new Date();

  const firstDayOfYear = new Date(now.getFullYear(), 0, 1); // 0 berarti Januari
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfYear);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const buildUrl = (baseUrl: string, params: Record<string, any>) => {
    const url = new URL(baseUrl);
    // Tambahkan parameter lainnya
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url.toString();
  };

  let instanceId2: any;
  let additionalParams: Record<string, any> = { limit: 10000000 };

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    instanceId2 = instansiId;
    additionalParams = {
      ...additionalParams,
      instansi_id: instanceId2,
    };
  } else {
    instanceId2 = instanceId;
    additionalParams = {
      ...additionalParams,
      instansi_id: instanceId2,
      search: searchTermInstance,
    };
  }

  // Pastikan startDate dan endDate dalam format yang benar
  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const params = {
    start_date: startDateFormatted,
    end_date: endDateFormatted,
    ...additionalParams,
  };

  console.log(params);

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/report`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: reports } = useSWR<any>(fixUrl, fetcher);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/report-pdf?instansi_id=${instanceId2}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        toast("Berhasil download laporan");
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const report = reports?.data?.report;

  return (
    <ProtectedRoute
      roles={["Super Admin", "Admin Instansi", "Admin Verifikasi"]}
    >
      <section className="mr-16">
        <div className="flex justify-between gap-x-5 mb-8">
          <div className="flex w-full gap-x-5 ">
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
            <div
              className={`flex items-center gap-x-2 ${role === "Admin Instansi" || role === "Admin Layanan" ? "w-full justify-between" : "w-8/12 justify-end"}`}
            >
              <div className="flex items-center gap-x-2 w-8/12">
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
              <Button
                onClick={handleDownload}
                className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    <Image
                      src="/icons/printer.svg"
                      alt="print"
                      width={24}
                      height={24}
                    />
                    Print
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        {report && (
          <DataTables
            columns={reportColumns}
            data={report}
            filterBy="name"
            type="requirement"
          />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default Report;
