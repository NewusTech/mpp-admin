"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { detailSurveyResultColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import ProtectedRoute from "@/components/ProtectedRoute";
import Cookies from "js-cookie";
import { useState } from "react";
import { Loader } from "lucide-react";
import InputComponent from "@/components/InputComponent";
import { formatDate } from "@/lib/utils";
import Swal from "sweetalert2";

const SurveyPrint = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const now = new Date();

  const firstDayOfYear = new Date(now.getFullYear(), 0, 1); // 0 berarti Januari
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfYear);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

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

  const param = {
    limit: 10000000, // atau false
    start_date: startDateFormatted, // atau undefined
    end_date: endDateFormatted, // atau undefined
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/${params.id}`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, param);

  const { data } = useSWR<any>(fixUrl, fetcher);

  const result = data?.data;

  const handleDownload = async () => {
    setIsLoading(true);
    let urlDownload = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/${params.id}/pdf`;

    try {
      const response = await fetch(urlDownload, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report layanan skm.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil download",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal download!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute
      roles={[
        "Super Admin",
        "Admin Instansi",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        {/*<div className="flex justify-between mb-8">*/}
        {/*  <div className="w-1/2">*/}
        {/*    <InputComponent typeInput="select" />*/}
        {/*  </div>*/}
        {/*  <Link href="/survey/result/[slug]">*/}
        {/*    <Button className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full">*/}
        {/*      <Image*/}
        {/*        src="/icons/printer.svg"*/}
        {/*        alt="[slug]"*/}
        {/*        width={24}*/}
        {/*        height={24}*/}
        {/*      />*/}
        {/*      Print*/}
        {/*    </Button>*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <div className="-ml-14 mb-10">
          <Link href="/survey/result">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="w-full h-full py-8 space-y-3 px-[64px] bg-neutral-50 shadow rounded-[20px]">
          <h1 className="text-xl font-semibold">Jenis Layanan</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
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
            <Button
              disabled={isLoading}
              onClick={handleDownload}
              className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
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
          </div>
          {result && (
            <DataTables
              columns={detailSurveyResultColumns}
              data={result}
              filterBy="name"
              type="requirement"
            />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default SurveyPrint;
