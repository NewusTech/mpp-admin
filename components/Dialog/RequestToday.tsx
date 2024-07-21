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

interface RequestTodayProps {
  count: number;
  title: string;
  background: string;
  type?: string;
  instansi_id?: any;
}

const RequestToday = ({
  title,
  count,
  background,
  type,
}: RequestTodayProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  const { data } = useSWR<any>(baseUrl, fetcher);

  const result = data?.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`rounded-[16px] transition-colors duration-300 cursor-pointer w-full bg-${background === "success" ? "success" : "error"}-700 hover:bg-${background === "success" ? "success" : "error"}-800 flex flex-col gap-y-4 items-center justify-center py-[40px] px-5 text-neutral-50`}
        >
          <p className="text-sm w-10/12 text-center">{title}</p>
          <h4 className="font-semibold text-[40px]">{count}</h4>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-full h-fit overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-primary-700">{title}</DialogTitle>
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

export default RequestToday;
