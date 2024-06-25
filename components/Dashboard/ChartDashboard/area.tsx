"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts"; // Import the ApexOptions type

interface AreaChartProps {
  data: {
    LayananId: number;
    LayananName: string;
    LayananformnumCount: number;
  }[];
}

const AreaChart = ({ data }: AreaChartProps) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
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
