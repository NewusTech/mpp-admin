"use client";

import InputComponent from "@/components/InputComponent";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { DataTables } from "@/components/Datatables";
import { dashboardSuperadminColumns } from "@/constants";
import BarChart from "@/components/Dashboard/ChartDashboard/bar";

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
      <Progress value={value} />
    </div>
  );
};

const DashboardSuperadmin = () => {
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const instanceId = Number(instance);

  const { data: history } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/superadmin?instansi_id=${instanceId}&limit=10000000`,
    fetcher,
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
  const serviceData: any = histories?.layananData;

  return (
    <div className="space-y-4">
      <div className="w-full py-4 px-8 rounded-[16px] shadow bg-neutral-50">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-3 text-slate-400">
            <p className="text-neutral-900">Year</p>
            <p>Month</p>
            <p>Week</p>
          </div>
          <div className="w-2/12">
            <InputComponent typeInput="select" />
          </div>
        </div>
        <div className="space-x-4 mt-4 flex justify-between">
          <Card color="bg-secondary-700" text="14,777" title="Antrian Online" />
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
            <p className="text-[10px] text-neutral-800">2024</p>
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
            <InputComponent typeInput="datepicker" />
            <p>to</p>
            <InputComponent typeInput="datepicker" />
          </div>
        </div>
        {serviceData && (
          <DataTables
            columns={dashboardSuperadminColumns}
            data={serviceData}
            filterBy="layanan_name"
            type="request"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardSuperadmin;
