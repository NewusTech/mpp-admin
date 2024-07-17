"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import TabQueue from "@/components/Dashboard/Instance/TabQueue";
import TabServiceInstance from "@/components/Dashboard/Instance/TabServiceInstance";
import TabSurvey from "@/components/Dashboard/Instance/TabSurvey";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import TabQueueService from "@/components/Dashboard/Service/TabQueueService";
import TabSurveyService from "@/components/Dashboard/Service/TabSurveyService";
import TabService from "@/components/Dashboard/Service/TabService";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const InstanceDashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);

        console.log(decoded);

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

  return (
    <>
      <div className="rounded-[16px] bg-primary-200 p-8 flex gap-x-[73px] items-center">
        <div className="w-[60px] h-[80px]">
          <Image
            src="/images/logo1.png"
            alt="Logo"
            className="w-full h-full object-contain"
            width={60}
            height={80}
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-[26px] font-semibold text-primary-800">
            Dinas Kependudukan dan Catatan Sipil
          </h1>
          {role === "Staff Instansi" && (
            <>
              <h4 className="text-sm text-primary-800">
                Pembuatan Kartu Keluarga (KK)
              </h4>
              <h4 className="text-sm text-primary-800">Loket 1</h4>
            </>
          )}
        </div>
      </div>
      <Tabs defaultValue="queue" className="my-8">
        <TabsList className="p-0 bg-transparent rounded-none w-full justify-between">
          <TabsTrigger
            value="queue"
            className="text-[26px] pb-3 text-secondary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-secondary-700 data-[state=active]:shadow-none"
          >
            Antrian
          </TabsTrigger>
          <TabsTrigger
            value="service"
            className="text-[26px] pb-3 text-primary-700 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-700 data-[state=active]:shadow-none"
          >
            Layanan
          </TabsTrigger>
          <TabsTrigger
            value="survey"
            className="text-[26px] pb-3 text-primary-800 font-bold w-full h-full data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:rounded-none data-[state=active]:border-neutral-500 data-[state=active]:text-primary-800 data-[state=active]:shadow-none"
          >
            Survey
          </TabsTrigger>
        </TabsList>
        <TabsContent value="queue" className="mt-8">
          {role === "Admin Instansi" ? <TabQueue /> : <TabQueueService />}
        </TabsContent>
        <TabsContent value="service">
          {role === "Admin Instansi" ? <TabServiceInstance /> : <TabService />}
        </TabsContent>
        <TabsContent value="survey">
          {role === "Admin Instansi" ? <TabSurvey /> : <TabSurveyService />}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default InstanceDashboard;
