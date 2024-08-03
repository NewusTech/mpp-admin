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

const TabSurvey = () => {
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<any>(
    new Date().getMonth() + 1,
  );

  useEffect(() => {
    const startYear = 2023; // Tahun mulai yang diinginkan
    const yearArray = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearArray.push(year);
    }
    setYears(yearArray);
  }, [currentYear]);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/admindinas-survey?year=${selectedYear}&month=${selectedMonth}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const result = data?.data;

  return (
    <section className="space-y-4 mt-8">
      <div className="flex justify-end space-x-4 items-center">
        <div className="w-2/12 flex space-x-2">
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
          <p className="text-center text-neutral-50 text-[20px] font-semibold">
            Total Nilai SKM Keseluruhan
          </p>
          <h4 className="font-semibold text-[40px] text-neutral-50">
            {result?.rataRataNilaiSKM?.toFixed(2) || 0}
          </h4>
          <p className="text-secondary-700 font-bold">
            {getDescription(result?.rataRataNilaiSKM?.toFixed(2))}
          </p>
        </div>
      </div>
      <div className="rounded-[16px] w-full bg-neutral-50 p-8 shadow space-y-8">
        <div className="flex items-center gap-x-2">
          <h1 className="text-primary-700 font-medium text-[16px]">
            Total Nilai SKM Per-Layanan
          </h1>
          <p className="text-neutral-800 font-semibold text-[10px]">
            {selectedYear}
          </p>
        </div>
        {result?.nilaiSKM_perlayanan?.length === 0 ? (
          <p>Data tidak tersedia</p>
        ) : (
          result?.nilaiSKM_perlayanan?.map((v: any) => (
            <ProgressBar
              id={v.id}
              key={v.id}
              name={v.layanan_name}
              value={
                v.Surveyformnums_nilai === 0
                  ? 0
                  : v.Surveyformnums_nilai?.toFixed(2)
              }
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TabSurvey;
