"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AreaChart from "@/components/Dashboard/ChartDashboard/area";
import DonutChart from "@/components/Dashboard/ChartDashboard/donut";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { DataTables } from "@/components/Datatables";
import { dashboardApprovalColumns } from "@/constants";
import InputComponent from "@/components/InputComponent";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { formatDate } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const buttons: any = [
  { label: "Semua", value: "" },
  { label: "Menunggu", value: 0 },
  { label: "Divalidasi", value: 1 },
  { label: "Disetujui", value: 2 },
  { label: "Selesai", value: 3 },
  { label: "Gagal", value: 4 },
  { label: "Tidak Sesuai", value: 5 },
];

const months = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

const TabServiceInstance = () => {
  const now = new Date();

  const firstDayOfYear = new Date(now.getFullYear(), 0, 1); // 0 berarti Januari
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfYear);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [activeButton, setActiveButton] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<any>(
    new Date().getMonth(),
  );
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
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

  const selectedMonthLabel = months.find(
    (month) => month.value === Number(selectedMonth),
  )?.label;

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

  const params = {
    instansi_id: instansiId,
    limit: 10000000,
    status: activeButton,
    start_date: startDateFormatted,
    end_date: endDateFormatted,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  const { data } = useSWR<any>(fixUrl, fetcher);

  const url =
    selectedMonth &&
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/admindinas?month=${selectedMonth}`;

  const { data: stats } = useSWR<any>(url, fetcher);

  const result = data?.data;
  const resultStats = stats?.data;
  const resultTop3Month = stats?.data.top3LayananMonth;
  const resultTop3Week = stats?.data.totalLayananPerDay;
  const resultTop3Week2 = stats?.data.totalLayanan7Days;

  console.log(resultTop3Week);

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/historyform/pdf?status=${activeButton}&instansi_id=${instansiId}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
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
      a.download = "report-layanan.pdf";
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

  return (
    <section className="space-y-4 mt-8">
      <div className="flex w-full gap-x-5">
        <div className="rounded-[16px] w-1/2 bg-neutral-50 shadow p-4">
          <div className="gap-x-2 mb-8 text-neutral-800 flex justify-center">
            <h3 className="text-primary-800 font-medium">TOP 3 Layanan</h3>
            <p>{selectedMonthLabel}</p>
          </div>
          <DonutChart data={resultTop3Month} />
          <div className="flex gap-x-5 justify-around mt-4">
            {resultTop3Month?.map((v: any, index: number) => {
              // Tentukan kelas latar belakang berdasarkan nilai index
              const bgClass =
                index === 0
                  ? "bg-primary-800"
                  : index === 1
                    ? "bg-primary-700"
                    : "bg-secondary-700";

              return (
                <div className="flex gap-x-2 items-center" key={v?.layananId}>
                  <div className={`w-2 h-2 ${bgClass} rounded-full`}></div>
                  <div>
                    <h3 className="text-sm text-neutral-900 font-semibold">
                      {v?.LayananformnumCount}
                    </h3>
                    <p className="text-xs text-neutral-800">{v?.LayananName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-[16px] w-1/2 bg-neutral-50 shadow p-4">
          <p className="text-right text-neutral-800 mb-10">7 Hari Terakhir</p>
          <AreaChart data={resultTop3Week} />
          <div className="flex gap-x-5 justify-around mt-4">
            {resultTop3Week2?.map((v: any, index: number) => {
              const bgClass =
                index === 0
                  ? "bg-primary-800"
                  : index === 1
                    ? "bg-primary-700"
                    : "bg-secondary-700";
              return (
                <div className="flex gap-x-2 items-center" key={v?.LayananId}>
                  <div className={`w-2 h-2 ${bgClass} rounded-full`}></div>
                  <div>
                    <h3 className="text-sm text-neutral-900 font-semibold">
                      {v?.LayananformnumCount}
                    </h3>
                    <p className="text-xs text-neutral-800">{v?.LayananName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 shadow p-12">
        <div className="rounded-full p-2 border bg-transparent w-[800px]">
          <div className="w-full flex space-x-2 justify-between">
            {buttons.map((button: any) => (
              <Button
                key={button.value}
                className={`rounded-[20px] ${
                  activeButton === button.value
                    ? "bg-primary-700 text-neutral-50"
                    : "bg-transparent text-neutral-800"
                } hover:text-neutral-50 hover:bg-primary-700`}
                onClick={() => handleClick(button.value)}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <div className="flex items-center w-5/12 space-x-2 ">
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
        <div className="mt-8">
          {result && (
            <DataTables
              columns={dashboardApprovalColumns}
              data={result}
              filterBy="name"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TabServiceInstance;
