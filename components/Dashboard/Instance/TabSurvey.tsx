"use client";

import LineChart from "@/components/Dashboard/ChartDashboard/line";
import { ProgressBar } from "@/components/Dashboard/Superadmin";
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

const TabSurvey = () => {
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const startYear = 2023; // Tahun mulai yang diinginkan
    const yearArray = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearArray.push(year);
    }
    setYears(yearArray);
  }, [currentYear]);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/dashboard/admindinas-survey?year=${selectedYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const result = data?.data;

  return (
    <section className="space-y-4 mt-8">
      <div className="flex justify-end space-x-4 items-center">
        <div className="w-2/12">
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
            {result?.rataRataNilaiSKM?.toFixed(2)}
          </h4>
          <p className="text-secondary-700">Sangat Baik</p>
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
        {result?.nilaiSKM_perlayanan?.map((v: any) => (
          <ProgressBar
            key={v.id}
            name={v.layanan_name}
            value={
              v.Surveyformnums_nilai === 0
                ? 0
                : v.Surveyformnums_nilai?.toFixed(2)
            }
          />
        ))}
      </div>
    </section>
  );
};

export default TabSurvey;
