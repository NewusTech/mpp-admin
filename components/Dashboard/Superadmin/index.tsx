"use client";

import InputComponent from "@/components/InputComponent";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { DataTables } from "@/components/Datatables";
import { dashboardSuperadminColumns } from "@/constants";
import BarChart from "@/components/Dashboard/ChartDashboard/bar";
import { Loader, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Card = ({
  color,
  title,
  text,
}: {
  color: string;
  title: string;
  text: string;
}) => {
  return (
    <div
      className={`${color} rounded-[16px] w-full h-[155px] flex flex-col items-center justify-center gap-y-10`}
    >
      <h5 className="text-neutral-900 text-sm w-[187px] text-center">
        {title}
      </h5>
      <h1 className="text-neutral-50 text-3xl font-medium">{text}</h1>
    </div>
  );
};

export function getDescription(value: number): string {
  if (value <= 0) {
    return "Belum Dinilai";
  } else if (value > 0 && value <= 30) {
    return "Sangat Buruk";
  } else if (value > 30 && value <= 50) {
    return "Buruk";
  } else if (value > 50 && value <= 75) {
    return "Cukup";
  } else if (value > 75 && value <= 90) {
    return "Baik";
  } else if (value > 90 && value <= 100) {
    return "Sangat Baik";
  }
  return "Nilai tidak valid";
}

function getBackgroundClass(description: string): string {
  switch (description) {
    case "Sangat Buruk":
      return "bg-error-700";
    case "Buruk":
      return "bg-error-500";
    case "Cukup":
      return "bg-warning-700";
    case "Baik":
      return "bg-primary-700";
    case "Sangat Baik":
      return "bg-success-700";
    case "Belum Dinilai":
      return "bg-neutral-700";
    default:
      return "";
  }
}

export const ProgressBar = ({
  name,
  value,
  id,
}: {
  name: string;
  value: number;
  id: number;
}) => {
  const description = getDescription(value);
  const backgroundClass = getBackgroundClass(description);

  return (
    <div className="flex space-x-3 items-center">
      <div className="w-full space-y-1">
        <div className="flex justify-between text-sm text-neutral-800">
          <Link
            href={`/survey/result/${id}`}
            className="hover:text-primary-700 hover:underline transition-colors duration-300"
          >
            <h4>{name}</h4>
          </Link>
          <Link
            href={`/survey/result/${id}`}
            className="hover:text-primary-700 hover:underline transition-colors duration-300"
          >
            <p>{value}</p>
          </Link>
        </div>
        <Progress value={value} />
      </div>
      <div
        className={`text-[10px] ${backgroundClass} rounded-lg text-neutral-50 px-2 py-1`}
      >
        <p className="text-center">{description}</p>
      </div>
    </div>
  );
};

const DashboardSuperadmin = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const startYear = 2023; // Tahun mulai yang diinginkan
    const yearArray = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearArray.push(year);
    }
    setYears(yearArray);
  }, [currentYear]);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const { data: history, isLoading } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/superadmin?year=${selectedYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
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

  const params = {
    instansi_id: instanceId,
    limit: 10000000, // atau false
    start_date: startDate, // atau undefined
    end_date: endDate,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/superadmin`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  const { data: serviceData, isLoading: isLoadingService } = useSWR<any>(
    fixUrl,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  const result = data?.data;
  const histories: any = history?.data;
  const countProgress: any = histories?.countbyInstansi;
  const chartCount: any = histories?.monthlyCounts;
  const services: any = serviceData?.data?.layananData;

  if (!histories) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="w-full py-4 px-8 rounded-[16px] shadow bg-neutral-50">
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex gap-x-3 text-slate-400">
            <p className="text-neutral-900">Tahun</p>
          </div>
          <div className="w-2/12">
            <Select
              value={selectedYear.toString()}
              onValueChange={(e: any) => setSelectedYear(e)}
            >
              <SelectTrigger className="w-full">
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
        </div>
        <div className="space-x-4 mt-4 flex justify-between">
          <Card
            color="bg-secondary-700"
            text="14,777"
            title="Antrian Online ee"
          />
          <Card
            color="bg-primary-700"
            text={histories?.permohonanCount}
            title="Permohonan Layanan"
          />
          <Card
            color="bg-neutral-700"
            text={histories?.skmCount}
            title="Survey Kepuasan Masyarakat (SKM)"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="rounded-[16px] w-6/12 shadow bg-neutral-50">
          <div className="p-4">
            <h1 className="text-[16px] font-medium ">
              Pengguna Layanan & Antrian
            </h1>
            <div className="flex gap-x-5 justify-end mt-5">
              <div className="flex gap-x-2 items-center justify-center">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <p className="text-xs font-medium text-neutral-800">
                  Permohonan Layanan
                </p>
              </div>
              <div className="flex gap-x-2 items-center justify-center">
                <div className="w-2 h-2 bg-secondary-700 rounded-full"></div>
                <p className="text-xs font-medium text-neutral-800">
                  Antrian Online
                </p>
              </div>
            </div>
            <BarChart chartData={chartCount} />
            <div className="w-full flex gap-x-3">
              <div className="rounded-[8px] w-full py-2 px-4 bg-slate-100 space-y-1">
                <h4 className="text-slate-400 text-sm">Permohonan Layanan</h4>
                <h1 className="text-neutral-900 text-3xl font-medium">
                  {histories?.permohonanCount}
                </h1>
              </div>
              <div className="rounded-[8px] w-full py-2 px-4 bg-slate-100 space-y-1">
                <h4 className="text-slate-400 text-sm">Antrian Online</h4>
                <h1 className="text-neutral-900 text-3xl font-medium">
                  15,777
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[16px] w-6/12 shadow bg-neutral-50 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-medium text-primary-800 w-[251px]">
              Antrian Online & Permohonan Layanan Tiap Instansi
            </h1>
            <p className="text-[10px] text-neutral-800">{selectedYear}</p>
          </div>
          <div className="space-y-8 mt-5">
            {countProgress
              ?.sort(
                (a: any, b: any) =>
                  b.layananformnum_count - a.layananformnum_count,
              )
              .slice(0, 5)
              .map((v: any) => (
                <ProgressBar
                  key={v.id}
                  id={v.id}
                  name={v.name}
                  value={v.layananformnum_count}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="rounded-[16px] bg-neutral-50 w-full p-12 shadow">
        <div className="flex justify-between mb-20 gap-x-8">
          <div className="w-1/2">
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
          </div>
          <div className="flex w-1/2 items-center gap-x-2">
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
        {services && (
          <DataTables
            columns={dashboardSuperadminColumns}
            data={services}
            filterBy="layanan_name"
            type="request"
          />
        )}
      </div>
    </section>
  );
};

export default DashboardSuperadmin;
