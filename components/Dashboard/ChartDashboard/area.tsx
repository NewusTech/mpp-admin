"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AreaChart = () => {
  const option = {
    chart: {
      id: "area",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar"],
    },
    dataLabels: {
      enabled: false,
    },
    // stroke: {
    //   curve: "straight",
    // },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      data: [10, 100, 57],
    },
    {
      data: [1, 200, 10],
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
