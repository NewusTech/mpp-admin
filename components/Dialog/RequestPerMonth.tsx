"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import InputComponent from "@/components/InputComponent";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { DataTables } from "@/components/Datatables";
import { dashboardApprovalColumns } from "@/constants";

const months = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

interface RequestTodayProps {
  count: number;
  title: string;
  background: string;
  type?: string;
  instansi_id?: any;
  month: any;
  year: any;
}

const RequestPerMonth = ({
  title,
  count,
  background,
  month,
  year,
  type,
}: RequestTodayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const monthLabel = months.find((v) => v.value === Number(month))?.label;

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform?month=${month}&year=${year}&status=${type === "success" ? 3 : 4}`;

  const { data } = useSWR<any>(baseUrl, fetcher);

  console.log(month);

  const result = data?.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`h-[62px] cursor-pointer w-full rounded-full px-7 py-2 bg-${background === "success" ? "success" : "error"}-700 hover:bg-${background === "success" ? "success" : "error"}-800 flex items-center justify-between mt-4`}
        >
          <p className="font-semibold text-neutral-50 text-xs w-8/12">
            {title}
          </p>
          <div className="rounded-full bg-neutral-50 items-center justify-center w-10 h-10 flex">
            <p
              className={`text-${background === "success" ? "success" : "error"}-700 font-semibold text-sm`}
            >
              {count}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-full h-fit">
        <DialogHeader>
          <DialogTitle className="text-primary-700">
            {title} Bulan {monthLabel} Tahun {year}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-10">
          {result && (
            <DataTables
              columns={dashboardApprovalColumns}
              data={result}
              filterBy="name"
              type="history"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPerMonth;
