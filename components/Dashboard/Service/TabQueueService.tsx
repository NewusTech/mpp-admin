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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const buttons: any = [
  { label: "Semua", value: "" },
  { label: "Menunggu", value: false },
  { label: "Selesai", value: true },
];

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

const TabQueueService = () => {
  const [role, setRole] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [instansiId, setInstansiId] = useState<any>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  return (
    <>
      <section className="bg-primary-200 px-8 py-9 rounded-[20px] shadow space-y-3">
        <div className="grid grid-cols-4 gap-x-5">
          <CardDashboardQueue
            title="Antrian Selesai"
            number={resultQueue.AntrianCount}
            background="text-success-700"
          />
          <CardDashboardQueue
            title="Antrian Sebelumnya"
            number={resultQueue.AntrianProsesCount}
            background="text-secondary-700"
          />
          <CardDashboardQueue
            title="Antrian Diproses"
            number={resultQueue.AntrianNextCount}
            background="text-primary-700"
          />
          <CardDashboardQueue
            title="Antrian Selanjutnya"
            number={resultQueue.AntrianProsesCount}
            background="text-error-700"
          />
        </div>
        <div className="flex w-full justify-end space-x-2">
          <Button className="bg-error-700 hover:bg-error-800 w-20 rounded-full">
            Call
          </Button>
          <Button className="bg-secondary-700 hover:bg-secondary-800 w-20 rounded-full">
            Recall
          </Button>
          <Button className="bg-neutral-800 hover:bg-neutral-900 w-20 rounded-full">
            Transfer
          </Button>
          <Button className="bg-success-700 hover:bg-success-800 w-20 rounded-full">
            Next
          </Button>
        </div>
      </section>
      <section className="rounded-[16px] bg-neutral-50 shadow p-8 my-10">
        <Tabs defaultValue="active">
          <TabsList className="p-0 justify-start rounded-none w-full bg-transparent border-b border-primary-700">
            <TabsTrigger
              value="active"
              className="text-sm px-3 text-primary-700 w-2/12 bg-primary-100 rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none font-bold h-full data-[state=active]:border-0 data-[state=active]:bg-primary-700 data-[state=active]:text-neutral-50"
            >
              Antrian
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-sm px-3 text-primary-700 w-2/12 bg-primary-100 rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none font-bold h-full data-[state=active]:border-0 data-[state=active]:bg-primary-700 data-[state=active]:text-neutral-50"
            >
              Layanan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-8">
            <section>
              <div className="rounded-full p-2 border bg-transparent w-[310px] mb-16">
                <div className="w-full flex space-x-2 justify-between">
                  {buttons.map((button: any) => (
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
              <div className="flex justify-end -mt-10">
                <Button
                  // onClick={handleDownload}
                  className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/icons/printer.svg"
                        alt="print"
                        width={24}
                        height={24}
                      />
                      Print
                    </>
                  )}
                </Button>
              </div>
              {result && (
                <DataTables
                  columns={queueColumns}
                  data={result}
                  filterBy="name"
                  type="queue"
                />
              )}
            </section>
          </TabsContent>
          <TabsContent value="history" className="mt-8">
            <section>
              <div className="flex justify-end space-x-2">
                <div className="flex w-5/12 items-center gap-x-2">
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
                <Button
                  // onClick={handleDownload}
                  className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[100px] rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/icons/printer.svg"
                        alt="print"
                        width={24}
                        height={24}
                      />
                      Print
                    </>
                  )}
                </Button>
              </div>
              {result && (
                <DataTables
                  columns={queueColumns}
                  data={result}
                  filterBy="name"
                  type="history"
                />
              )}
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default TabQueueService;
