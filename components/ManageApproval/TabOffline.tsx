import InputComponent from "@/components/InputComponent";
import { DataTables } from "@/components/Datatables";
import { manageApprovalColumns } from "@/constants";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

interface TabOfflineProps {
  serviceId: number;
  instanceId: number | null;
}

export default function TabOffline({ serviceId, instanceId }: TabOfflineProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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

  const params = {
    instansi_id: instanceId,
    layanan_id: serviceId,
    limit: 10000000, // atau false
    start_date: startDate, // atau undefined
    end_date: endDate, // atau undefined
    status: 1,
    isOnline: 0,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: histories } = useSWR<any>(fixUrl, fetcher);

  const historyAll = histories?.data;

  return (
    <>
      <div className="flex justify-end">
        <div className="flex w-6/12 items-center gap-x-2">
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
