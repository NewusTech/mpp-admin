import InputComponent from "@/components/InputComponent";
import { DataTables } from "@/components/Datatables";
import { manageApprovalColumns } from "@/constants";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface TabOfflineProps {
  serviceId: number | null;
  instanceId: number | null;
  role: string | null;
}

export default function TabOffline({
  serviceId,
  instanceId,
  role,
}: TabOfflineProps) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Pastikan startDate dan endDate dalam format yang benar
  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const params = {
    instansi_id: instanceId,
    layanan_id: serviceId,
    limit: 10000000, // atau false
    start_date: startDateFormatted, // atau undefined
    end_date: endDateFormatted, // atau undefined
    status: 1,
    isonline: 0,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: histories } = useSWR<any>(fixUrl, fetcher);

  const historyAll = histories?.data;

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/historyform/pdf?status=1&isonline=0&instansi_id=${instanceId}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
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
      a.download = "report permohonan offline yang sudah divalidasi.pdf";
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

  return (
    <>
      <div className="flex justify-end mb-8 space-x-2">
        <div className="flex w-4/12 items-center gap-x-2">
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
        {instanceId || role === "Admin Instansi" || role === "Admin Layanan" ? (
          <Button
            disabled={isLoading}
            onClick={handleDownload}
            className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[100px] rounded-full"
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
            disabled={true}
            className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
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
      {histories && (
        <DataTables
          columns={manageApprovalColumns}
          data={historyAll}
          filterBy="name"
        />
      )}
    </>
  );
}
