"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import { Report as Reports } from "@/types/type";
import { reportColumns } from "@/constants";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

const Report = () => {
  const [instance, setInstance] = useState<string>("");

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  const { data: reports } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/report?instansi_id=${instanceId}`,
    fetcher,
  );

  const result = data?.data;
  const report = reports?.data?.report;

  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-full gap-x-5">
          <InputComponent
            typeInput="select"
            value={instance}
            onChange={(e) => setInstance(e)}
            items={result}
            label="Instansi"
            placeholder="Pilih Instansi"
          />
          <div className="flex w-8/12 items-center gap-x-2">
            <InputComponent typeInput="datepicker" />
            <p>to</p>
            <InputComponent typeInput="datepicker" />
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
        </div>
      </div>
      {report && (
        <DataTables
          columns={reportColumns}
          data={report}
          filterBy="name"
          type="requirement"
        />
      )}
    </section>
  );
};

export default Report;
