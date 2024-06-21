"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts"; // Import the ApexOptions type

const AreaChart = () => {
  const option: ApexOptions = {
    chart: {
      id: "area",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar"],
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

  const series = [
    {
      name: "Layanan 1",
      data: [10, 150, 57],
    },
    {
      name: "Layanan 2",
      data: [1, 200, 10],
    },
    {
      name: "Layanan 3",
      data: [1, 100, 90],
    },
  ];

  return (
    <>
      <ApexChart
        type="area"
        options={option}
        series={series}
        height="100%"
        width="100%"
      />
    </>
  );
};

export default AreaChart;
