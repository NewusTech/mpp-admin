"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts"; // Import the ApexOptions type

interface ChartDashboardProps {
  monthlyAntrianCounts: { [key: string]: number };
  permohonanan_bulan: { [key: string]: number };
}

const ChartDashboard = ({
  monthlyAntrianCounts,
  permohonanan_bulan,
}: ChartDashboardProps) => {
  if (monthlyAntrianCounts == null || permohonanan_bulan === null) {
    return <p className="text-center text-neutral-800">Data tidak tersedia</p>;
  }
  const option: ApexOptions = {
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agst",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#3568C0", "#FF9742"],
  };

  const series = [
    {
      name: "Booking Antrian",
      data: Object.values(monthlyAntrianCounts),
    },
    {
      name: "Permohonan Layanan Online",
      data: Object.values(permohonanan_bulan),
    },
  ];

  return (
    <>
      <ApexChart
        type="line"
        options={option}
        series={series}
        height="80%"
        width="100%"
      />
    </>
  );
};

export default ChartDashboard;
