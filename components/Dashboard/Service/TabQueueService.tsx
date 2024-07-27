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
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DataTables } from "@/components/Datatables";
import { historyQueueColumns, activeQueueColumns } from "@/constants";
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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

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
      <h3 className="text-[15px] text-neutral-800 font-semibold text-center">
        {title}
      </h3>
      <h1 className={`text-lg ${background} font-bold`}>{number}</h1>
    </div>
  );
};

const TabQueueService = ({ id }: { id: string }) => {
  const [activeButton, setActiveButton] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTwo, setIsLoadingTwo] = useState<boolean>(false);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [audioUrl, setAudioUrl] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isLoadingFetchAudio, setIsLoadingFetchAudio] =
    useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: queue, mutate: mutateQueue } = useSWR(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API_URL}/panggilantrian/get/${id}`
      : null,
    fetcher,
  );

  const buildUrl = (baseUrl: string, params: Record<string, any>) => {
    const url = new URL(baseUrl);
    // Tambahkan parameter lainnya
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url.toString();
  };

  const buildUrlToday = (baseUrl: string, params: Record<string, any>) => {
    const url = new URL(baseUrl);
    // Tambahkan parameter lainnya
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url.toString();
  };

  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/admlayanan-antrian`;

  const params = {
    limit: 10000000,
    start_date: startDateFormatted,
    end_date: endDateFormatted,
  };
  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  const { data, mutate: mutateQueueActive } = useSWR<any>(fixUrl, fetcher);

  const paramsToday = {
    limit: 10000000,
    status: activeButton,
    range: "today",
  };
  // Bangun URL berdasarkan role dan instanceId
  const fixUrlToday = buildUrlToday(baseUrl, paramsToday);

  const { data: today, mutate: dashboardToday } = useSWR<any>(
    fixUrlToday,
    fetcher,
  );

  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [audioUrl]);

  const fetchAudio = async () => {
    setIsLoadingFetchAudio(true);
    setShouldFetch(true);
    if (queue && queue.data.audio) {
      setAudioUrl(queue.data.audio);
      await mutateQueueActive();
      await dashboardToday();
      await mutateQueue();
    }
    setIsLoadingFetchAudio(false);
  };

  const replayAudio = () => {
    if (audioRef.current) {
      setIsLoadingAudio(true);
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((error) => {
          console.error("Error replaying audio:", error);
        })
        .finally(() => {
          setIsLoadingAudio(false);
        });
    }
  };

  const result = data?.data;
  const riwayat = result?.riwayatAntrian;
  const riwayatToday = today?.data?.riwayatAntrian;

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/antrian/pdf?start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report-antrian.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        toast("Berhasil download laporan");
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadNow = async () => {
    setIsLoadingTwo(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/antrian/pdf?range=today&status=${activeButton}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report-antrian-hari-ini.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        toast("Berhasil download laporan");
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setIsLoadingTwo(false);
    }
  };

  return (
    <>
      <section className="bg-primary-200 px-8 py-9 rounded-[20px] shadow space-y-3">
        <div className="grid grid-cols-5 gap-x-5">
          <CardDashboardQueue
            title="Total Antrian"
            number={result?.AntrianCount || 0}
            background="text-neutral-900"
          />
          <CardDashboardQueue
            title="Antrian Selesai"
            number={result?.AntrianSelesaiCount || 0}
            background="text-success-700"
          />
          <CardDashboardQueue
            title="Antrian Sebelumnya"
            number={result?.AntrianSebelumnya || 0}
            background="text-secondary-700"
          />
          <CardDashboardQueue
            title="Antrian Diproses"
            number={result?.AntrianProses || 0}
            background="text-primary-700"
          />
          <CardDashboardQueue
            title="Antrian Selanjutnya"
            number={result?.AntrianNext || 0}
            background="text-error-700"
          />
        </div>
        <div className="flex w-full justify-end space-x-2">
          <Button
            className="bg-secondary-700 hover:bg-secondary-800 w-20 rounded-full"
            onClick={replayAudio}
            disabled={isLoadingAudio}
          >
            {isLoadingAudio ? <Loader className="animate-spin" /> : "Recall"}
          </Button>
          <Button className="bg-neutral-800 hover:bg-neutral-900 w-20 rounded-full">
            Transfer
          </Button>
          <Button
            onClick={fetchAudio}
            className="bg-success-700 hover:bg-success-800 w-20 rounded-full"
            disabled={isLoadingFetchAudio}
          >
            {isLoadingFetchAudio ? <Loader className="animate-spin" /> : "Next"}
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
                  onClick={handleDownloadNow}
                  className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[100px] rounded-full"
                  disabled={isLoadingTwo}
                >
                  {isLoadingTwo ? (
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
              {riwayatToday && (
                <DataTables
                  columns={activeQueueColumns}
                  data={riwayatToday}
                  filterBy="code"
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
                {startDateFormatted && endDateFormatted ? (
                  <Button
                    onClick={handleDownload}
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
                ) : (
                  <Button
                    className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[100px] rounded-full"
                    disabled={true}
                  >
                    <Image
                      src="/icons/printer.svg"
                      alt="print"
                      width={24}
                      height={24}
                    />
                    Print
                  </Button>
                )}
              </div>
              {riwayat && (
                <DataTables
                  columns={historyQueueColumns}
                  data={riwayat}
                  filterBy="code"
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
