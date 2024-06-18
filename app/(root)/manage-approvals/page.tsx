"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { manageApprovalColumns } from "@/constants";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useState } from "react";

const ManageApprovals = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  const { data: services } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${instanceId}`,
    fetcher,
  );

  const serviceId = Number(service);

  const { data: histories } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/historyform?instansi_id=${instanceId}&layanan_id=${serviceId}`,
    fetcher,
  );

  const result = data?.data;
  const serviceAll = services?.data;
  const historyAll = histories?.data;

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
          <InputComponent
            typeInput="select"
            value={service}
            onChange={(e) => setService(e)}
            items={serviceAll}
            label="Jenis Layanan"
            placeholder="Pilih Jenis Layanan"
          />
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="flex gap-x-3">
          <Button className="border bg-transparent border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-neutral-50 w-[140px] rounded-full">
            Online
          </Button>
          <Button className="border bg-transparent border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-neutral-50 w-[140px] rounded-full">
            Offline
          </Button>
        </div>
        <div className="flex w-4/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      {histories && (
        <DataTables
          columns={manageApprovalColumns}
          data={historyAll}
          filterBy="name"
          type="requirement"
        />
      )}
    </section>
  );
};

export default ManageApprovals;
