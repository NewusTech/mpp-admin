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
import Swal from "sweetalert2";
import { Progress } from "@/components/ui/progress";
import {
  getBackgroundClass,
  getDescription,
} from "@/components/Dashboard/Superadmin";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  instansi: string;
}

const ReportPerformance = () => {
  const [instance, setInstance] = useState({
    id: "",
    name: "",
  });
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [instansiName, setInstansiName] = useState<string | undefined>(
    undefined,
  );
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
        console.log(decoded);
        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role && decoded.instansi_id !== undefined) {
          setRole(decoded.role);
          setInstansiId(decoded.instansi_id);
          setInstansiName(decoded.instansi);
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

  const instanceId = Number(instance.id);

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

  let instanceName;

  if (
    role !== "Admin Instansi" &&
    role !== "Admin Layanan" &&
    role !== "Admin Verifikasi"
  ) {
    instanceName = instance.name;
  } else {
    instanceName = instansiName;
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

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/kinerja/${instanceId2}`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: reports } = useSWR<any>(fixUrl, fetcher);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/pdf-kinerja/${instanceId2}?start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
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
      a.download = "laporan-kinerja.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil download",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal download!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
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
  const report = reports?.data;
  const kinerja = report?.instansi[0]?.kinerja;
  const perRequest = report?.report_perlayanan;
  console.log(perRequest);

  const description = getDescription(kinerja);
  const backgroundClass = getBackgroundClass(description);

  return (
    <ProtectedRoute
      roles={["Super Admin", "Admin Instansi", "Admin Verifikasi"]}
    >
      <section className="mr-16">
        <div className="flex justify-between gap-x-5 mb-8">
          <div className="flex w-full gap-x-5 ">
            {role !== "Admin Instansi" &&
              role !== "Admin Layanan" &&
              role !== "Admin Verifikasi" && (
                <InputComponent
                  typeInput="selectSearch"
                  valueInput={searchInputInstance}
                  onChangeInputSearch={(e) =>
                    setSearchInputInstance(e.target.value)
                  }
                  items={result}
                  label="Instansi"
                  placeholder="Pilih Instansi"
                  value={instance.id}
                  onChange={(value) => {
                    // Temukan item yang sesuai dari result berdasarkan id yang dipilih
                    const selectedItem = result.find(
                      (item: any) => item.id === value,
                    );
                    if (selectedItem) {
                      setInstance({
                        id: selectedItem.id,
                        name: selectedItem.name,
                      });
                    }
                  }}
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
        <div className="w-full h-full rounded neutral-50 shadow py-[26px] px-8 ">
          <h4 className="text-secondary-700 font-semibold">
            Kinerja {instanceName}
          </h4>
          <div className="flex space-x-2">
            <div className="w-full">
              <p className="text-end text-neutral-800 text-sm">{kinerja}%</p>
              <Progress indicator="bg-secondary-700" value={kinerja} />
            </div>
            <div
              className={`text-[10px] ${backgroundClass} h-9 w-20 flex items-center justify-center rounded-lg text-neutral-50 px-2 py-1`}
            >
              <p className="text-center">{description}</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full rounded neutral-50 shadow py-[26px] px-8 mt-5 space-y-5">
          <h4 className="text-primary-700 font-semibold">
            Kinerja Per Layanan {instanceName}
          </h4>
          {perRequest?.map((v: any) => (
            <div key={v?.id} className="flex space-x-2">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-neutral-800">{v?.name}</p>
                  <p className="text-neutral-800 text-sm">{v?.kinerja}%</p>
                </div>
                <Progress indicator="bg-primary-700" value={v?.kinerja} />
              </div>
              <div
                className={`text-[10px] ${backgroundClass} h-9 w-20 flex items-center justify-center rounded-lg text-neutral-50 px-2 py-1`}
              >
                <p className="text-center">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default ReportPerformance;
