"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartDataProps {
  month: string;
  permohonanCount: number;
  skmCount: number;
}

interface BarChartProps {
  chartData: ChartDataProps[];
}

const BarChart = ({ chartData }: BarChartProps) => {
  const permohonanData = chartData?.map((data: any) => data.permohonanCount);
  const months = chartData?.map((data: any) => data.month);
  const queues = chartData?.map((data: any) => data.antrianCount);

  const option = {
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories: months,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#3568C0", "#FF9742"],
    plotOptions: {
      bar: {
        columnWidth: "20%",
      },
    },
  };

  const series = [
    {
      name: "Permohonan Layanan",
      data: permohonanData,
    },
    {
      name: "Antrian Online",
      data: queues,
    },
  ];

  return (
    <>
      <ApexChart
        type="bar"
        options={option}
        series={series}
        height="75%"
        width="100%"
      />
    </>
  );
};

export default BarChart;
