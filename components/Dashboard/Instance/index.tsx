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
  layanan_code: string;
  layanan: string;
  instansi_image: string;
  instansi: string;
  layanan_id: number;
  layanan_slug: string;
}

const InstanceDashboard = () => {
  const [state, setState] = useState({
    role: "",
    instansiId: 0,
    serviceCode: "",
    serviceName: "",
    image: "",
    instanceName: "",
    serviceId: 0,
    slug: "",
  });

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
          setState({
            role: decoded.role,
            instansiId: decoded.instansi_id,
            serviceCode: decoded.layanan_code,
            serviceName: decoded.layanan,
            image: decoded.instansi_image,
            instanceName: decoded.instansi,
            serviceId: decoded.layanan_id,
            slug: decoded.layanan_slug,
          });
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
          {state.image && (
            <Image
              src={state.image}
              alt="Logo"
              className="w-full h-full object-contain"
              width={60}
              height={80}
            />
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-[26px] font-semibold text-primary-800">
            {state.instanceName}
          </h1>
          {state.role === "Admin Layanan" && (
            <>
              <h4 className="text-sm text-primary-800">{state.serviceName}</h4>
              <h4 className="text-sm text-primary-800">
                Loket {state.serviceCode}
              </h4>
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
          {state.role === "Admin Instansi" ? (
            <TabQueue />
          ) : (
            <TabQueueService id={state.slug} />
          )}
        </TabsContent>
        <TabsContent value="service">
          {state.role === "Admin Instansi" ? (
            <TabServiceInstance />
          ) : (
            <TabService />
          )}
        </TabsContent>
        <TabsContent value="survey">
          {state.role === "Admin Instansi" ? (
            <TabSurvey />
          ) : (
            <TabSurveyService id={state.serviceId} />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default InstanceDashboard;
