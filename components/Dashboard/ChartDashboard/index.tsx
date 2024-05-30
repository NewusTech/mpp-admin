"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartDashboard = () => {
  const option = {
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Des",
      ],
    },
    stroke: {
      curve: "smooth",
    },
  };

  const series = [
    {
      name: "Tahun 2024",
      data: [30, 90, 35, 100, 49, 60, 200, 10, 400, 100, 300],
    },
  ];

  return (
    <>
      <ApexChart
        type="line"
        options={option}
        series={series}
        height={300}
        width={900}
      />
    </>
  );
};

export default ChartDashboard;
