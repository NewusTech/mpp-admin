import InputComponent from "@/components/InputComponent";
import { DataTables } from "@/components/Datatables";
import { revisionColumns } from "@/constants";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { formatDate } from "@/lib/utils";
import useRevisionStore from "@/lib/store/useRevisionStore";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";

interface TabRevisionProps {
  serviceId: number | null;
  instanceId: number | null;
  role: string | null;
}

export default function TabRevision({
  serviceId,
  instanceId,
  role,
}: TabRevisionProps) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const setCountRevision = useRevisionStore((state) => state.setCountRevision);
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
    status: 5,
    isOnline: 1,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: histories } = useSWR<any>(fixUrl, fetcher);

  const historyAll = histories?.data;
  const countHistory = histories?.pagination?.totalCount;

  useEffect(() => {
    setCountRevision(countHistory);
  }, [countHistory, setCountRevision]);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/historyform/pdf?status=5&instansi_id=${instanceId}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
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
      a.download = "report permohonan yang belum diperbaiki.pdf";
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
          columns={revisionColumns}
          data={historyAll}
          filterBy="name"
        />
      )}
    </>
  );
}
