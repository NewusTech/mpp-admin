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
import DonutChart from "@/components/Dashboard/ChartDashboard/donut";
import AreaChart from "@/components/Dashboard/ChartDashboard/area";

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

export const ProgressBar = ({
  name,
  value,
}: {
  name: string;
  value: number;
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-neutral-800">
        <h4>{name}</h4>
        <p>{value}</p>
      </div>
      <Progress indicator="bg-primary-700" value={value} />
    </div>
  );
};

const DashboardBupati = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

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
    fetcher
  );

  const instanceId = Number(instance);

  const { data: serviceData, isLoading: isLoadingService } = useSWR<any>(
    instance
      ? `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/superadmin?instansi_id=${instanceId}&limit=10000000`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance]);

  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <Loader className="animate-spin w-40" />
  //     </div>
  //   );
  // }

  const result = data?.data;
  // const histories: any = history?.data;
  // const countProgress: any = histories?.countbyInstansi;
  // const chartCount: any = histories?.monthlyCounts;
  const services: any = serviceData?.data?.layananData;
  //
  // if (!histories) {
  //   return null;
  // }

  return (
    <div className="space-y-4">
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
          <Card color="bg-secondary-700" text="14,777" title="Antrian Online" />
          <Card color="bg-primary-700" text="ya" title="Permohonan Layanan" />
          <Card
            color="bg-neutral-700"
            text="ya"
            title="Survey Kepuasan Masyarakat (SKM)"
          />
        </div>
      </div>
      {/*<div className="flex w-full gap-x-5">*/}
      {/*  <div className="rounded-[16px] w-1/2 bg-neutral-50 shadow p-4">*/}
      {/*    <div className="gap-x-2 mb-8 text-neutral-800 flex justify-center">*/}
      {/*      <h3 className="text-primary-800 font-medium">TOP 3 Layanan</h3>*/}
      {/*      <p>{selectedMonthLabel}</p>*/}
      {/*    </div>*/}
      {/*    <DonutChart data={resultTop3Month} />*/}
      {/*    <div className="flex gap-x-5 justify-around mt-4">*/}
      {/*      {resultTop3Month?.map((v: any, index: number) => {*/}
      {/*        // Tentukan kelas latar belakang berdasarkan nilai index*/}
      {/*        const bgClass =*/}
      {/*          index === 0*/}
      {/*            ? "bg-primary-800"*/}
      {/*            : index === 1*/}
      {/*              ? "bg-primary-700"*/}
      {/*              : "bg-secondary-700";*/}

      {/*        return (*/}
      {/*          <div className="flex gap-x-2 items-center" key={v?.layananId}>*/}
      {/*            <div className={`w-2 h-2 ${bgClass} rounded-full`}></div>*/}
      {/*            <div>*/}
      {/*              <h3 className="text-sm text-neutral-900 font-semibold">*/}
      {/*                {v?.LayananformnumCount}*/}
      {/*              </h3>*/}
      {/*              <p className="text-xs text-neutral-800">{v?.LayananName}</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="rounded-[16px] w-1/2 bg-neutral-50 shadow p-4">*/}
      {/*    <p className="text-right text-neutral-800 mb-10">Last 7 Days</p>*/}
      {/*    <AreaChart data={resultTop3Week} />*/}
      {/*    <div className="flex gap-x-5 justify-around mt-4">*/}
      {/*      {resultTop3Week?.map((v: any, index: number) => {*/}
      {/*        // Tentukan kelas latar belakang berdasarkan nilai index*/}
      {/*        const bgClass =*/}
      {/*          index === 0*/}
      {/*            ? "bg-primary-800"*/}
      {/*            : index === 1*/}
      {/*              ? "bg-primary-700"*/}
      {/*              : "bg-secondary-700";*/}

      {/*        return (*/}
      {/*          <div className="flex gap-x-2 items-center" key={v?.layananId}>*/}
      {/*            <div className={`w-2 h-2 ${bgClass} rounded-full`}></div>*/}
      {/*            <div>*/}
      {/*              <h3 className="text-sm text-neutral-900 font-semibold">*/}
      {/*                {v?.LayananformnumCount}*/}
      {/*              </h3>*/}
      {/*              <p className="text-xs text-neutral-800">{v?.LayananName}</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="rounded-[16px] w-full bg-neutral-50 p-8 shadow space-y-8">
        <div className="flex items-center justify-between gap-x-2">
          <h1 className="text-primary-700 font-medium text-[16px]">
            Data Pengguna Layanan Per-Instansi
          </h1>
          <p className="text-neutral-800 font-semibold text-[10px]">2024</p>
        </div>
        <ProgressBar name="Nama Instansi" value={10} />
        <ProgressBar name="Nama Instansi" value={20} />
        <ProgressBar name="Nama Instansi" value={30} />
        <ProgressBar name="Nama Instansi" value={40} />
        <ProgressBar name="Nama Instansi" value={50} />
        <ProgressBar name="Nama Instansi" value={60} />
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 p-8 shadow space-y-8">
        <h1 className="text-primary-700 font-medium text-[16px]">
          Data Pengguna Per-Layanan
        </h1>
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
            <InputComponent typeInput="datepicker" />
            <p>to</p>
            <InputComponent typeInput="datepicker" />
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
    </div>
  );
};

export default DashboardBupati;
