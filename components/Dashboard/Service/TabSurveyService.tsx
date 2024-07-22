"use client";

import LineChart from "@/components/Dashboard/ChartDashboard/line";
import { getDescription, ProgressBar } from "@/components/Dashboard/Superadmin";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import { DataTables } from "@/components/Datatables";
import { detailSurveyResultColumns } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

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

const TabSurveyService = ({ id }: { id: number }) => {
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<any>(
    new Date().getMonth() + 1,
  );

  const handleDownload = async () => {
    setIsLoading(true);
    let urlDownload = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/id/pdf`;

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
        toast("Berhasil download laporan");
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const startYear = 2023; // Tahun mulai yang diinginkan
    const yearArray = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearArray.push(year);
    }
    setYears(yearArray);
  }, [currentYear]);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/admlayanan-survey?year=${selectedYear}&month=${selectedMonth}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

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
    limit: 10000000, // atau false
    start_date: startDateFormatted, // atau undefined
    end_date: endDateFormatted, // atau undefined
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/${id}`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  const { data: survey } = useSWR<any>(fixUrl, fetcher);

  const result = data?.data;
  const resultSurvey = survey?.data;

  return (
    <section className="space-y-4 mt-8">
      <div className="flex justify-end space-x-4 items-center">
        <div className="w-2/12 flex space-x-3">
          <Select
            value={selectedMonth?.toString()}
            onValueChange={(e) => setSelectedMonth(e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bulan</SelectLabel>
                {months.map((v) => (
                  <SelectItem key={v.value} value={v.value.toString()}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={selectedYear.toString()}
            onValueChange={(e: any) => setSelectedYear(e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun</SelectLabel>
                {years?.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full flex gap-x-4">
        <div className="rounded-[16px] w-6/12 bg-neutral-50 shadow p-4">
          <LineChart data={result?.surveyformnumPerBulan} />
        </div>
        <div className="rounded-[16px] w-6/12 bg-primary-700 p-4 flex flex-col justify-center items-center space-y-5">
          <p className="text-center text-primary-800 text-[20px] font-semibold">
            Total Nilai SKM Keseluruhan
          </p>
          <h4 className="font-semibold text-[40px] text-neutral-50">
            {result?.rataRataNilaiSKM?.toFixed(2) || 0}
          </h4>
          <p className="text-secondary-700">
            {getDescription(result?.rataRataNilaiSKM?.toFixed(2))}
          </p>
        </div>
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 p-8 shadow">
        <div className="flex items-center justify-end space-x-2">
          <div className="flex w-5/12 items-center gap-x-2">
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
        </div>
        {resultSurvey && (
          <DataTables
            columns={detailSurveyResultColumns}
            data={resultSurvey}
            filterBy="name"
            type="history"
          />
        )}
      </div>
    </section>
  );
};

export default TabSurveyService;
