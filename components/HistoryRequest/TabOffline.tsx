import InputComponent from "@/components/InputComponent";
import { DataTables } from "@/components/Datatables";
import { historyApprovalColumns } from "@/constants";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface TabOfflineProps {
  serviceId: number | null;
  instanceId: number | null;
  role: string | null;
}

const buttons: any = [
  { label: "Semua", value: "" },
  { label: "Menunggu", value: 0 },
  { label: "Divalidasi", value: 1 },
  { label: "Disetujui", value: 2 },
  { label: "Selesai", value: 3 },
  { label: "Gagal", value: 4 },
  { label: "Perbaikan", value: 5 },
  { label: "Diperbaiki", value: 6 },
];

export default function TabOffline({
  serviceId,
  instanceId,
  role,
}: TabOfflineProps) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [activeButton, setActiveButton] = useState("");
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
    isonline: 0,
    status: activeButton,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: histories } = useSWR<any>(fixUrl, fetcher);

  const historyAll = histories?.data;

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/historyform/pdf?status=${activeButton}&isonline=0&instansi_id=${instanceId}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
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
      a.download = "report riwayat permohonan offline.pdf";
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
      <div className="flex gap-x-3">
        {buttons.map((button: any) => (
          <Button
            key={button.value}
            size="sm"
            className={`border border-primary-700 text-xs hover:bg-primary-700 hover:text-neutral-50 rounded-full ${
              activeButton === button.value
                ? "bg-primary-700 text-neutral-50"
                : "bg-transparent text-primary-700"
            }`}
            onClick={() => handleClick(button.value)}
          >
            {button.label}
          </Button>
        ))}
      </div>
      <div className="flex w-full items-center gap-x-2 justify-end mt-5 mb-8">
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
          columns={historyApprovalColumns}
          data={historyAll}
          filterBy="name"
        />
      )}
    </>
  );
}
