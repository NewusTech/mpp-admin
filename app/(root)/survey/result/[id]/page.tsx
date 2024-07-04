"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { detailSurveyResultColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import ProtectedRoute from "@/components/ProtectedRoute";

// async function getData(id: number): Promise<DetailSurveyResult[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/${id}`,
//     {
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     },
//   );
//
//   const data = await res.json();
//
//   return data?.data;
// }

const SurveyPrint = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey/${params.id}`,
    fetcher,
  );

  const result = data?.data;

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Staff Instansi"]}>
      <section className="mr-16">
        {/*<div className="flex justify-between mb-8">*/}
        {/*  <div className="w-1/2">*/}
        {/*    <InputComponent typeInput="select" />*/}
        {/*  </div>*/}
        {/*  <Link href="/survey/result/[slug]">*/}
        {/*    <Button className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full">*/}
        {/*      <Image*/}
        {/*        src="/icons/printer.svg"*/}
        {/*        alt="[slug]"*/}
        {/*        width={24}*/}
        {/*        height={24}*/}
        {/*      />*/}
        {/*      Print*/}
        {/*    </Button>*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <div className="-ml-14 mb-10">
          <Link href="/survey/result">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="w-full h-full py-8 px-[64px] bg-neutral-50 shadow rounded-[20px]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Jenis Layanan</h1>
            <Button className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full">
              <Image
                src="/icons/printer.svg"
                alt="print"
                width={24}
                height={24}
              />
              Print
            </Button>
          </div>
          {result && (
            <DataTables
              columns={detailSurveyResultColumns}
              data={result}
              filterBy="name"
              type="requirement"
            />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default SurveyPrint;
