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
import { useState } from "react";

const buttons = [
  { label: "Semua", value: 6 },
  { label: "Menunggu", value: 0 },
  { label: "Divalidasi", value: 1 },
  { label: "Disetujui", value: 3 },
  { label: "Selesai", value: 4 },
  { label: "Gagal", value: 5 },
];

const TabService = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (value: any) => {
    setActiveButton(value);
    // Kirim nilai aktif ke server atau lakukan aksi lain yang diinginkan
    console.log("Button clicked with value:", value);
  };

  return (
    <section className="space-y-4 mt-8">
      <div className="flex w-full gap-x-4">
        <div className="rounded-[16px] w-8/12 bg-neutral-50 shadow p-8 gap-x-4 flex">
          <div className="rounded-[16px] w-full bg-success-700 flex gap-y-4 flex-col items-center justify-center py-[40px] px-5 text-neutral-50">
            <p className="text-sm w-10/12 text-center">
              Permohonan Layanan Selesai Hari Ini
            </p>
            <h4 className="font-semibold text-[40px]">8</h4>
          </div>
          <div className="rounded-[16px] w-full bg-error-700 flex flex-col gap-y-4 items-center justify-center py-[40px] px-5 text-neutral-50">
            <p className="text-sm w-10/12 text-center">
              Permohonan Layanan Gagal Hari Ini
            </p>
            <h4 className="font-semibold text-[40px]">28</h4>
          </div>
          <div></div>
        </div>
        <div className="rounded-[16px] w-4/12 bg-neutral-50 shadow p-4">
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
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-success-700 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs w-8/12">
              Permohonanan Layanan Selesai
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-success-700 font-semibold text-sm">80</p>
            </div>
          </div>
          <div className="h-[62px] w-full rounded-full px-7 py-2 bg-error-700 flex items-center justify-between mt-4">
            <p className="font-semibold text-neutral-50 text-xs w-8/12">
              Permohonanan Layanan Gagal
            </p>
            <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
              <p className="text-error-700 font-semibold text-sm">80</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-x-5">
        <div className="rounded-[16px] w-1/2 bg-neutral-50 shadow p-4">
          <div className="flex gap-x-2 mb-8 text-neutral-800 flex justify-center">
            <h3 className="text-primary-800 font-medium">TOP 3 Layanan</h3>
            <p>Januari</p>
          </div>
          {/*<DonutChart />*/}
          <div className="flex gap-x-5 justify-around mt-4">
            <div className="flex gap-x-2 items-center">
              <div className="w-2 h-2 bg-primary-800 rounded-full"></div>
              <div>
                <h3 className="text-sm text-neutral-900 font-semibold">300</h3>
                <p className="text-xs text-neutral-800">Layanan 1</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
              <div>
                <h3 className="text-sm text-neutral-900 font-semibold">300</h3>
                <p className="text-xs text-neutral-800">Layanan 1</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-2 h-2 bg-secondary-700 rounded-full"></div>
              <div>
                <h3 className="text-sm text-neutral-900 font-semibold">300</h3>
                <p className="text-xs text-neutral-800">Layanan 1</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[16px] w-1/2 bg-neutral-50 shadow p-4">
          <p className="text-right text-neutral-800 mb-10">Last 7 Days</p>
          <AreaChart />
          <div className="flex gap-x-5 justify-around mt-4">
            <div className="flex gap-x-2 items-center">
              <div className="w-2 h-2 bg-primary-800 rounded-full"></div>
              <div>
                <h3 className="text-sm text-neutral-900 font-semibold">300</h3>
                <p className="text-xs text-neutral-800">Layanan 1</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
              <div>
                <h3 className="text-sm text-neutral-900 font-semibold">300</h3>
                <p className="text-xs text-neutral-800">Layanan 1</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-2 h-2 bg-secondary-700 rounded-full"></div>
              <div>
                <h3 className="text-sm text-neutral-900 font-semibold">300</h3>
                <p className="text-xs text-neutral-800">Layanan 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 shadow p-12">
        <div className="rounded-full p-2 border bg-transparent w-[78%] flex space-x-2">
          {buttons.map((button) => (
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
    </section>
  );
};

export default TabService;
