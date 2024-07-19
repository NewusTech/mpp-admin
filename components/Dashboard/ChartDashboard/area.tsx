"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts"; // Import the ApexOptions type

interface Top3Data {
  LayananId: number;
  LayananName: string;
  LayananformnumCount: number;
}

interface ChartData {
  date: string;
  top3: Top3Data[];
}

interface AreaChartProps {
  data: ChartData[];
}

const AreaChart = ({ data }: AreaChartProps) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-neutral-800">Data tidak tersedia</p>;
  }

  const seriesNames = data[0]?.top3.map((item) => item.LayananName);
  const dates = data.map((item) =>
    new Date(item.date).toLocaleDateString("id-ID", { weekday: "long" }),
  );

  const seriesData = seriesNames.map((name) => {
    return {
      name,
      data: data.map((item) => {
        const layanan = item.top3.find(
          (layanan) => layanan.LayananName === name,
        );
        return layanan ? layanan.LayananformnumCount : 0;
      }),
    };
  });

  const option: ApexOptions = {
    chart: {
      id: "area",
    },
    xaxis: {
      categories: dates,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    legend: {
      show: false,
    },
    colors: ["#1D3A6C", "#3568C0", "#FF9742"],
  };

  return (
    <>
      <ApexChart
        type="area"
        options={option}
        series={seriesData}
        height="70%"
        width="100%"
      />
    </>
  );
};

export default AreaChart;
