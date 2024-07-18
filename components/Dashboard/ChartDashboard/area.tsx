"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts"; // Import the ApexOptions type

interface AreaChartProps {
  data?: {
    LayananId: number;
    LayananName: string;
    LayananformnumCount: number;
  }[];
}

const AreaChart = ({ data }: AreaChartProps) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-neutral-800">Data tidak tersedia</p>;
  }

  const option: ApexOptions = {
    chart: {
      id: "area",
    },
    labels: data?.map((item) => item.LayananName),
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

  const seriesData = data?.map((item) => ({
    name: item.LayananName,
    data: [item.LayananformnumCount],
  }));

  const series = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "series3",
      data: [1, 60, 100, 70, 100, 70, 50],
    },
  ];

  return (
    <>
      <ApexChart
        type="area"
        options={option}
        series={series}
        height="70%"
        width="100%"
      />
    </>
  );
};

export default AreaChart;
