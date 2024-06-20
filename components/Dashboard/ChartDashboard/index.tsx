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
    // stroke: {
    //   curve: "smooth",
    // },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
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

export default ChartDashboard;
