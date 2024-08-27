"use client";

import Cookies from "js-cookie";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: any) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch QR code");
      }
      return res.blob(); // Mendapatkan respons sebagai blob
    })
    .then((blob) => URL.createObjectURL(blob));

const ModalBarcode = ({ id }: { id: number }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data: qrCodeUrl, error } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/barcodesurvey/${id}`,
    fetcher,
  );

  useEffect(() => {
    // Membersihkan URL blob saat komponen dibongkar untuk menghindari kebocoran memori
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);

  const handlePrint = () => {
    if (!qrCodeUrl) return;

    // Membuka tab baru
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Menyisipkan konten gambar ke tab baru
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
          </head>
          <body>
            <img src="${qrCodeUrl}" alt="QR Code" style="width: 70%; height: auto;" />
          </body>
        </html>
      `);

      // Memanggil print setelah tab baru siap
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <div
          onClick={handleOpenAddModal}
          className="py-1 px-2 w-full hover:bg-slate-100 cursor-pointer"
        >
          <p className="text-sm">Barcode</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center w-96 justify-center border-0 rounded-[20px] overflow-auto gap-y-10">
        <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-primary-700 hover:bg-primary-800 text-neutral-50 rounded-full px-[37px]"
            onClick={handlePrint}
          >
            {/*{isLoading ? <Loader className="animate-spin" /> : "Print"}*/}
            Print
          </AlertDialogAction>
          <AlertDialogCancel
            type="button"
            onClick={handleAddModalClose}
            className="bg-neutral-700 hover:bg-neutral-800 text-neutral-50 hover:text-neutral-50 rounded-full px-[37px]"
          >
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalBarcode;
