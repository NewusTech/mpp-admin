"use client";

import InputComponent from "@/components/InputComponent";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CardDashboardQueue from "@/components/Dashboard/CardDashboardQueue";
import ChartDashboard from "@/components/Dashboard/ChartDashboard";

export default function Home() {
  return (
    <section className="mr-16">
      <div className="flex items-center justify-between">
        <InputComponent typeInput="select" />
        <div className="flex gap-x-6 items-center">
          <div className="flex items-center space-x-2">
            <Label htmlFor="airplane-mode" className="text-secondary-700">
              Offline
            </Label>
            <Switch
              id="airplane-mode"
              className="data-[state=checked]:bg-secondary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-secondary-700"
              thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-secondary-700 data-[state=unchecked]:ml-[2px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="airplane-mode" className="text-primary-700">
              Online
            </Label>
            <Switch
              id="airplane-mode"
              className="data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-primary-700"
              thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-primary-700 data-[state=unchecked]:ml-[2px]"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-5 mt-[54px]">
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
      </div>
      <div className="flex gap-x-2 mt-4">
        <div className="w-8/12 rounded-[20px] p-6 shadow">
          <div className="flex items-center gap-x-6">
            <h4 className="text-[16px] text-neutral-900 font-semibold">
              Statistik
            </h4>
            <p className="text-[10px] text-neutral-800 font-semibold">2024</p>
          </div>
          <div className="flex gap-x-5 mt-5">
            <div className="flex gap-x-5">
              <div></div>
              <p className="text-sm font-medium text-neutral-800">
                Booking Antrian
              </p>
            </div>
            <div>
              <div></div>
              <p className="text-sm font-medium text-neutral-800">
                Permohonan Layanan Online
              </p>
            </div>
          </div>
          <ChartDashboard />
        </div>
      </div>
    </section>
  );
}
