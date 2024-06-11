"use client";

import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { RequestOffline as Request } from "@/types/type";
import { requestOfflineColumns } from "@/constants";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useState } from "react";
import { fetcher } from "@/lib/fetch";

// async function getData(): Promise<Request[]> {
//   return [
//     {
//       id: 1,
//       date: "18-08-2022",
//       nik: "098171829103891",
//       status: "menunggu",
//     },
//     // ...
//   ];
// }

const RequestOffline = () => {
  // const data = await getData();

  const [instance, setInstance] = useState<number>(0);
  const [service, setService] = useState<number>(0);

  const {
    data: instances,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`, fetcher);

  const {
    data: services,
    error: isError,
    isLoading: loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${instance}`,
    fetcher,
  );

  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-7/12 gap-x-5">
          <InputComponent
            typeInput="select"
            items={instances?.data}
            label="Instansi"
            placeholder="Pilih Instansi"
            value={instance}
            onChange={(e: number) => setInstance(e)}
          />
          <InputComponent
            typeInput="select"
            items={services?.data}
            label="Layanan"
            placeholder="Pilih Layanan"
            value={service}
            onChange={(e: number) => setService(e)}
          />
        </div>
        <div className="flex w-5/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      <div className="flex justify-between ">
        <Link href="/request/offline/create">
          <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
            Tambah
          </Button>
        </Link>
        <div className="w-4/12">
          <InputComponent />
        </div>
      </div>
      {/*<DataTables columns={requestOfflineColumns} data={data} />*/}
    </section>
  );
};

export default RequestOffline;
