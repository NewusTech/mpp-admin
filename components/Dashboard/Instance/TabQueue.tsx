"use client";

import ChartDashboard from "@/components/Dashboard/ChartDashboard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardDashboardQueueProps } from "@/types/interface";
import useSWR from "swr";
import { dataKiosk, fetcher, fetcherWithoutAuth } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DataTables } from "@/components/Datatables";
import { queueColumns } from "@/constants";
import useQueueStore from "@/lib/store/useQueueStore";
import { Button } from "@/components/ui/button";
import { AlertDialogChangeStatus } from "@/components/Dialog/change-status";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialogChangeStatusRequest } from "@/components/Dialog/change-active-request";
import { AlertDialogChangeStatusRequestNonactive } from "@/components/Dialog/change-nonactive-request";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const CardDashboardQueue = ({
  title,
  number,
  background,
}: CardDashboardQueueProps) => {
  return (
    <div className="w-full h-[152px] bg-primary-50 rounded-[20px] flex flex-col items-center justify-center gap-4">
      <h3 className="text-[16px] text-neutral-800 font-semibold">{title}</h3>
      <h1 className={`text-[40px] ${background} font-bold`}>{number}</h1>
    </div>
  );
};

const TabQueue = () => {
  const [role, setRole] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [instansiId, setInstansiId] = useState<any>(0);
  const { switchValues } = useQueueStore();
  const [checkedRequest, setCheckedRequest] = useState(false);
  const [checkedBooking, setCheckedBooking] = useState(false);

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

  useEffect(() => {
    if (switchValues.length > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [switchValues]);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${instansiId}?limit=10000000`,
    fetcher,
  );

  const result = data?.data;

  // const { data: kioska } = useSWR<any>(
  //   `${process.env.NEXT_PUBLIC_API_URL_KIOSKA}/dashboard_antrian/${instansiId}`,
  //   fetcherWithoutAuth,
  // );

  const resultQueue = dataKiosk.data;

  return (
    <>
      <section className="bg-primary-200 px-8 py-9 rounded-[20px] shadow space-y-3">
        <div className="grid grid-cols-3 gap-x-5">
          <CardDashboardQueue
            title="Total Antrian Hari Ini"
            number={resultQueue.AntrianCount}
            background="text-primary-700"
          />
          <CardDashboardQueue
            title="Antrian Diproses"
            number={resultQueue.AntrianProsesCount}
            background="text-secondary-700"
          />
          <CardDashboardQueue
            title="Antrian Selanjutnya"
            number={resultQueue.AntrianNextCount}
            background="text-primary-800"
          />
        </div>
        <div className="flex w-full justify-end space-x-2">
          <Button className="bg-success-700 hover:bg-success-800 w-20">
            Call
          </Button>
          <Button className="bg-error-700 hover:bg-error-800 w-20">
            Recall
          </Button>
        </div>
      </section>
      <div className="w-full rounded-[20px] p-6 shadow my-6">
        <div className="flex items-center gap-x-6">
          <h4 className="text-[16px] text-neutral-900 font-semibold">
            Statistik
          </h4>
          <p className="text-[10px] text-neutral-800 font-semibold">2024</p>
        </div>
        <div className="flex gap-x-5 mt-5">
          <div className="flex gap-x-2 items-center justify-center">
            <div className="w-2 h-2 bg-secondary-700 rounded-full"></div>
            <p className="text-xs font-medium text-neutral-800">
              Booking Antrian
            </p>
          </div>
          <div className="flex gap-x-2 items-center justify-center">
            <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
            <p className="text-xs font-medium text-neutral-800">
              Permohonan Layanan Online
            </p>
          </div>
        </div>
        <ChartDashboard
          monthlyAntrianCounts={resultQueue.monthlyAntrianCounts}
          permohonanan_bulan={resultQueue.permohonanan_bulan}
        />
      </div>
      <h4 className="text-neutral-900 text-[16px] font-semibold text-right">
        Aktif/nonaktifkan seluruh layanan
      </h4>
      <div className="flex items-center justify-end space-x-5 my-6 bg-neutral-50 shadow rounded-full p-4">
        {/*<div className="flex items-center space-x-2">*/}
        {/*  <Label*/}
        {/*    htmlFor="airplane-mode"*/}
        {/*    className="text-primary-700 font-semibold"*/}
        {/*  >*/}
        {/*    Booking Offline*/}
        {/*  </Label>*/}
        {/*  <Switch*/}
        {/*    id="airplane-mode"*/}
        {/*    className="data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-primary-700"*/}
        {/*    thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-primary-700 data-[state=unchecked]:ml-[2px]"*/}
        {/*  />*/}
        {/*</div>*/}
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="airplane-mode"
            className="text-secondary-700 font-semibold"
          >
            Permohonan Online
          </Label>
          <AlertDialogChangeStatusRequest id={instansiId} />
          <AlertDialogChangeStatusRequestNonactive id={instansiId} />
        </div>
      </div>
      <h4 className="text-neutral-900 text-[16px] font-semibold">
        Aktif/nonaktifkan per layanan
      </h4>
      {result && (
        <>
          <DataTables
            columns={queueColumns}
            data={result}
            filterBy="name"
            type="requirement"
          />
          <div className="-mt-8">
            {showButton && <AlertDialogChangeStatus />}
          </div>
        </>
      )}
    </>
  );
};

export default TabQueue;
