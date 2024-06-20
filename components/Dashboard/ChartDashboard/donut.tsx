"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DonutChart = () => {
  const options = {
    chart: {
      id: "donut",
    },
    labels: ["Series A", "Series B", "Series C"], // Labels for the donut chart
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  const series = [44, 55, 41]; // Series data for the donut chart

  return (
    <>
      <ApexChart type="donut" options={options} series={series} height="190%" />
    </>
  );
};

export default DonutChart;
