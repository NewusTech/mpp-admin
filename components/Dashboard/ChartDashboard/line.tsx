"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = () => {
  const option = {
    chart: {
      id: "line",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    },
    // stroke: {
    //   curve: "smooth",
    // },
    dataLabels: {
      enabled: false,
    },
    colors: ["#1D3A6C", "#3568C0", "#FF9742"],
  };

  const series = [
    {
      name: "Survey",
      data: [10, 50, 30, 100, 80, 30],
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
