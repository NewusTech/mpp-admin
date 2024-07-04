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
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DataTables } from "@/components/Datatables";
import { queueColumns } from "@/constants";
import useQueueStore from "@/lib/store/useQueueStore";
import { Button } from "@/components/ui/button";

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
    <div
      className={`w-full h-[152px] ${background} rounded-[20px] flex flex-col items-center justify-center gap-4`}
    >
      <h3 className="text-[16px] text-neutral-50 font-semibold">{title}</h3>
      <h1 className="text-[40px] text-neutral-50 font-bold">{number}</h1>
    </div>
  );
};

const TabQueue = () => {
  const [role, setRole] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [instansiId, setInstansiId] = useState<any>(0);
  const { switchValues } = useQueueStore();

  console.log(switchValues);

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

  return (
    <>
      <section className="grid grid-cols-3 gap-x-5">
        <CardDashboardQueue
          title="Total Antrian Hari Ini"
          number={20}
          background="bg-secondary-700"
        />
        <CardDashboardQueue
          title="Antrian Ke -"
          number={10}
          background="bg-primary-800"
        />
        <CardDashboardQueue
          title="Permohonan Online Hari Ini"
          number={20}
          background="bg-primary-700"
        />
      </section>
      <div className="flex gap-x-2 my-4">
        <div className="w-8/12 rounded-[20px] p-6 shadow">
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
          <ChartDashboard />
        </div>
        <div className="w-4/12 rounded-[20px] shadow p-4">
          <Select>
            <SelectTrigger className="w-[180px] border-0 font-semibold">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-secondary-700 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs">
              Total Permohonanan Online
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-secondary-700 font-semibold text-sm">80</p>
            </div>
          </div>
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-primary-700 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs">
              Total Antrian Online
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-primary-700 font-semibold text-sm">80</p>
            </div>
          </div>
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-primary-800 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs">
              Total Permohonanan Selesai
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-primary-800 font-semibold text-sm">80</p>
            </div>
          </div>
        </div>
      </div>
      {result && (
        <>
          <DataTables
            columns={queueColumns}
            data={result}
            filterBy="name"
            type="requirement"
          />
          <div className="-mt-8">
            {showButton && (
              <Button className="bg-primary-700 hover:bg-primary-800 rounded-full">
                Submit
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TabQueue;
