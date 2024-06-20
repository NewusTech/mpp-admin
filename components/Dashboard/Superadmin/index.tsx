"use client";

import InputComponent from "@/components/InputComponent";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { DataTables } from "@/components/Datatables";
import { dashboardSuperadminColumns } from "@/constants";
import BarChart from "@/components/Dashboard/ChartDashboard/bar";

const getAll = [
  {
    tanggal: "2024-06-01",
    name: "Dinas Kependudukan dan Catatan Sipil",
    service: "Pembuatan KTP",
    antrian: 5,
    request: 3,
    skm: 4.5,
  },
  {
    tanggal: "2024-06-02",
    name: "Dinas Kesehatan",
    service: "Pelayanan Kesehatan Masyarakat",
    antrian: 7,
    request: 6,
    skm: 4.7,
  },
  {
    tanggal: "2024-06-03",
    name: "Dinas Pendidikan",
    service: "Pendaftaran Sekolah",
    antrian: 4,
    request: 2,
    skm: 4.2,
  },
  {
    tanggal: "2024-06-04",
    name: "Dinas Perhubungan",
    service: "Perpanjangan SIM",
    antrian: 9,
    request: 8,
    skm: 4.9,
  },
  {
    tanggal: "2024-06-05",
    name: "Dinas Sosial",
    service: "Bantuan Sosial",
    antrian: 6,
    request: 5,
    skm: 4.6,
  },
  {
    tanggal: "2024-06-06",
    name: "Dinas Pekerjaan Umum",
    service: "Izin Mendirikan Bangunan",
    antrian: 8,
    request: 7,
    skm: 4.8,
  },
  {
    tanggal: "2024-06-07",
    name: "Dinas Pariwisata",
    service: "Izin Usaha Pariwisata",
    antrian: 10,
    request: 9,
    skm: 5.0,
  },
  {
    tanggal: "2024-06-08",
    name: "Dinas Pertanian",
    service: "Penyuluhan Pertanian",
    antrian: 3,
    request: 1,
    skm: 4.0,
  },
  {
    tanggal: "2024-06-09",
    name: "Dinas Perindustrian dan Perdagangan",
    service: "Pendaftaran Merek Dagang",
    antrian: 5,
    request: 4,
    skm: 4.3,
  },
  {
    tanggal: "2024-06-10",
    name: "Dinas Lingkungan Hidup",
    service: "Pengelolaan Sampah",
    antrian: 7,
    request: 6,
    skm: 4.7,
  },
];

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

const ProgressBar = ({ name, value }: { name: string; value: number }) => {
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
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  // const { data: surveys } = useSWR<any>(
  //   `${process.env.NEXT_PUBLIC_API_URL}/user/survey/form/${instanceId}`,
  //   fetcher,
  // );

  const result = data?.data;
  // const surveyAll = surveys?.data?.Surveyforms;

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
            text="14,777"
            title="Permohonan Layanan"
          />
          <Card
            color="bg-neutral-700"
            text="14,777"
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
            <BarChart />
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
            <ProgressBar name="Nama Instansi" value={33} />
            <ProgressBar name="Nama Instansi" value={13} />
            <ProgressBar name="Nama Instansi" value={93} />
            <ProgressBar name="Nama Instansi" value={100} />
            <ProgressBar name="Nama Instansi" value={50} />
          </div>
        </div>
      </div>
      <div className="rounded-[16px] bg-neutral-50 w-full p-12 shadow">
        <div className="flex justify-between mb-20 gap-x-8">
          <div className="w-1/2">
            <InputComponent
              typeInput="select"
              value={instance}
              onChange={(e) => setInstance(e)}
              items={result}
              label="Instansi"
              placeholder="Pilih Instansi"
            />
          </div>
          <div className="flex w-1/2 items-center gap-x-2">
            <InputComponent typeInput="datepicker" />
            <p>to</p>
            <InputComponent typeInput="datepicker" />
          </div>
        </div>
        <DataTables
          columns={dashboardSuperadminColumns}
          data={getAll}
          filterBy="instance"
          type="request"
        />
      </div>
    </div>
  );
};

export default DashboardSuperadmin;
