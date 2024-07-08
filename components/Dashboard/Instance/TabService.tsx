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

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const buttons: any = [
  { label: "Semua", value: "" },
  { label: "Menunggu", value: 0 },
  { label: "Divalidasi", value: 1 },
  { label: "Disetujui", value: 3 },
  { label: "Selesai", value: 4 },
  { label: "Gagal", value: 5 },
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

const TabService = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [activeButton, setActiveButton] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<any>(
    new Date().getMonth(),
  );
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);

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

  const params = {
    instansi_id: instansiId,
    limit: 10000000,
    status: activeButton,
    start_date: startDate,
    end_date: endDate,
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
  const resultTop3Week = stats?.data.top3LayananWeek;

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  return (
    <section className="space-y-4 mt-8">
      <div className="flex w-full gap-x-4">
        <div className="rounded-[16px] w-8/12 bg-neutral-50 shadow p-8 gap-x-4 flex">
          <div className="rounded-[16px] w-full bg-success-700 flex gap-y-4 flex-col items-center justify-center py-[40px] px-5 text-neutral-50">
            <p className="text-sm w-10/12 text-center">
              Permohonan Layanan Selesai Hari Ini
            </p>
            <h4 className="font-semibold text-[40px]">
              {resultStats?.permohonanCountToday}
            </h4>
          </div>
          <div className="rounded-[16px] w-full bg-error-700 flex flex-col gap-y-4 items-center justify-center py-[40px] px-5 text-neutral-50">
            <p className="text-sm w-10/12 text-center">
              Permohonan Layanan Gagal Hari Ini
            </p>
            <h4 className="font-semibold text-[40px]">
              {resultStats?.permohonanGagalToday}
            </h4>
          </div>
          <div></div>
        </div>
        <div className="rounded-[16px] w-4/12 bg-neutral-50 shadow p-4">
          <Select
            value={selectedMonth?.toString()}
            onValueChange={(e) => setSelectedMonth(e)}
          >
            <SelectTrigger className="w-[180px] border-0 font-semibold">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bulan</SelectLabel>
                {months.map((v) => (
                  <SelectItem key={v.value} value={v.value.toString()}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-success-700 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs w-8/12">
              Permohonanan Layanan Selesai
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-success-700 font-semibold text-sm">
                {resultStats?.permohonanCountMonth || 0}
              </p>
            </div>
          </div>
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-error-700 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs w-8/12">
              Permohonanan Layanan Gagal
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-error-700 font-semibold text-sm">
                {resultStats?.permohonanGagalMonth || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
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
          <p className="text-right text-neutral-800 mb-10">Last 7 Days</p>
          <AreaChart data={resultTop3Week} />
          <div className="flex gap-x-5 justify-around mt-4">
            {resultTop3Week?.map((v: any, index: number) => {
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
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 shadow p-12">
        <div className="rounded-full p-2 border bg-transparent w-[78%] flex space-x-2">
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

export default TabService;
