import InputComponent from "@/components/InputComponent";
import { DataTables } from "@/components/Datatables";
import { manageApprovalColumns } from "@/constants";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface TabOnlineProps {
  serviceId: number;
  instanceId: number | null;
}

const buttons: any = [
  { label: "Semua", value: "" },
  { label: "Menunggu", value: 0 },
  { label: "Divalidasi", value: 1 },
  { label: "Disetujui", value: 2 },
  { label: "Selesai", value: 3 },
  { label: "Gagal", value: 4 },
  { label: "Tidak Sesuai", value: 5 },
];

export default function TabOnline({ serviceId, instanceId }: TabOnlineProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [activeButton, setActiveButton] = useState("");

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
    status: activeButton,
    isonline: 1,
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

  return (
    <>
      <div className="flex justify-between">
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
        <div className="flex w-[320px] items-center gap-x-2">
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
      </div>
      {histories && (
        <DataTables
          columns={manageApprovalColumns}
          data={historyAll}
          filterBy="name"
          type="requirement"
        />
      )}
    </>
  );
}
