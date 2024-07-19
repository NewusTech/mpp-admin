"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = ({ data }: { data: [] }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-neutral-800">Data tidak tersedia</p>;
  }

  const totals = data ? data.map((v: any) => v.total) : [];

  const option = {
    chart: {
      id: "line",
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
        "Agus",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#3568C0"],
  };

  const series = [
    {
      name: "Total Nilai Survey",
      data: totals,
    },
  ];

  return (
    <>
      <ApexChart
        type="line"
        options={option}
        series={series}
        height="140%"
        width="100%"
      />
    </>
  );
};

export default LineChart;
