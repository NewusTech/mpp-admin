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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  layanan_id: number;
}

const SurveyResult = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [layananId, setLayananId] = useState<number | null>(null);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey`;

  let instanceId2;

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    instanceId2 = instansiId;
  } else if ("Super Admin") {
    instanceId2 = instanceId;
  }

  const handleDownload = async () => {
    setIsLoading(true);
    let urlDownload = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/pdf`;

    try {
      const response = await fetch(urlDownload, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report skm.pdf";
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

  // Pastikan startDate dan endDate dalam format yang benar
  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const param = {
    instansi_id: instanceId2,
    limit: 10000000, // atau false
    start_date: startDateFormatted, // atau undefined
    end_date: endDateFormatted, // atau undefined
  };

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(url, param);

  const { data: resultSurvey } = useSWR<any>(fixUrl, fetcher);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const surveys = resultSurvey?.data;

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Admin Layanan"]}>
      <section className="mr-16">
        <div className="flex justify-between mb-8 space-x-3">
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
          <div className="flex w-5/12 items-center gap-x-2">
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
          {instance || role === "Admin Instansi" || role === "Admin Layanan" ? (
            <Button
              disabled={isLoading}
              onClick={handleDownload}
              className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
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
          ) : (
            <Button
              disabled={true}
              className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
            >
              <Image
                src="/icons/printer.svg"
                alt="print"
                width={24}
                height={24}
              />
              Print
            </Button>
          )}
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
