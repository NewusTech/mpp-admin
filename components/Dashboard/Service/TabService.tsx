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
import RequestToday from "@/components/Dialog/RequestToday";
import RequestPerMonth from "@/components/Dialog/RequestPerMonth";

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

const TabService = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [activeButton, setActiveButton] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<any>(
    new Date().getMonth() + 1,
  );
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const startYear = 2020; // Tahun mulai yang diinginkan
    const yearArray = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearArray.push(year);
    }
    setYears(yearArray);
  }, [currentYear]);

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
    (selectedMonth || selectedYear) &&
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/admlayanan-layanan?month=${selectedMonth}&year=${selectedYear}`;

  const { data: stats } = useSWR<any>(url, fetcher);

  const result = data?.data;
  const resultStats = stats?.data;
  console.log(resultStats);

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  function getFormattedDate(): string {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const today = new Date();
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();

    return `${day} ${month} ${year}`;
  }

  return (
    <section className="space-y-4 mt-8">
      <div className="flex w-full gap-x-4">
        <div className="rounded-[16px] w-8/12 bg-neutral-50 shadow p-8 space-y-4">
          <p className="text-right font-semibold">{getFormattedDate()}</p>
          <div className="flex gap-x-4">
            <RequestToday
              title="Permohonan Layanan Selesai Hari Ini"
              count={resultStats?.permohonanCountToday}
              background="success"
              type="success"
            />
            <RequestToday
              title="Permohonan Layanan Gagal Hari Ini"
              count={resultStats?.permohonanGagalToday}
              background="error"
              type="error"
            />
          </div>
        </div>
        <div className="rounded-[16px] w-4/12 bg-neutral-50 shadow p-4">
          <div className="flex justify-between">
            <Select
              value={selectedMonth?.toString()}
              onValueChange={(e) => setSelectedMonth(e)}
            >
              <SelectTrigger className="w-full border-0 font-semibold">
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
            <Select
              value={selectedYear.toString()}
              onValueChange={(e: any) => setSelectedYear(e)}
            >
              <SelectTrigger className="w-full border-0 font-semibold">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  {years?.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <RequestPerMonth
            title="Permohonanan Layanan Selesai"
            background="success"
            count={resultStats?.permohonanCountMonth || 0}
            type="success"
            month={selectedMonth}
            year={selectedYear}
          />
          <RequestPerMonth
            title="Permohonanan Layanan Gagal"
            background="error"
            count={resultStats?.permohonanGagalMonth || 0}
            type="error"
            month={selectedMonth}
            year={selectedYear}
          />
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
        <div className="flex justify-end mt-10 space-x-2">
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
          <Button
            // onClick={handleDownload}
            className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[100px] rounded-full"
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
        {result && (
          <DataTables
            columns={dashboardApprovalColumns}
            data={result}
            filterBy="name"
            type="history"
          />
        )}
      </div>
    </section>
  );
};

export default TabService;
