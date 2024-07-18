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
      <DialogContent className="max-w-fit h-fit">
        <DialogHeader>
          <DialogTitle className="text-primary-700">{title}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RequestToday;
