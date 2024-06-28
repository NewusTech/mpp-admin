"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutChartProps {
  data: {
    LayananId: number;
    LayananName: string;
    LayananformnumCount: number;
  }[];
}

const AreaChart = ({ data }: DonutChartProps) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-neutral-800">Data tidak tersedia</p>;
  }

  const option = {
    chart: {
      id: "donut",
    },
    labels: data?.map((item) => item.LayananName),
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#1D3A6C", "#3568C0", "#FF9742"],
  };

  const series = data?.map((item) => item.LayananformnumCount);

  return (
    <>
      <ApexChart
        type="donut"
        options={option}
        series={series}
        height="90%"
        width="100%"
      />
    </>
  );
};

export default AreaChart;
