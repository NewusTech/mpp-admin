"use client";

import InputComponent from "@/components/InputComponent";
import { requestOnlineColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { useEffect, useState } from "react";
import useCreateRequestOffline from "@/lib/store/useCreateRequestOffline";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const RequestOnline = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const setServiceId = useCreateRequestOffline((state) => state.setServiceId);
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);

        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role && decoded.instansi_id !== undefined) {
          setRole(decoded.role);
          setInstansiId(decoded.instansi_id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  console.log(role, instansiId);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get`;

  if (role === "Admin Instansi") {
    url += `/${instansiId}`;
  } else if ("Superadmin") {
    url += `/${instanceId}`;
  }

  const { data: services } = useSWR(url, fetcher);

  const serviceId = Number(service);

  let historyUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  if (role === "Admin Instansi" && instansiId !== null) {
    historyUrl += `?instansi_id=${instansiId}&layanan_id=${serviceId}`;
  } else if (role === "Super Admin") {
    historyUrl += `?instansi_id=${instanceId}&layanan_id=${serviceId}`;
  }

  const { data: histories } = useSWR<any>(historyUrl, fetcher);

  console.log(histories);

  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-9/12 gap-x-5">
          {role !== "Admin Instansi" && (
            <InputComponent
              typeInput="select"
              items={data?.data}
              label="Instansi"
              placeholder="Pilih Instansi"
              value={instance}
              onChange={(e: any) => setInstance(e)}
            />
          )}
          <InputComponent
            typeInput="select"
            items={services?.data}
            label="Layanan"
            placeholder="Pilih Layanan"
            value={service}
            onChange={(e: any) => setService(e)}
          />
        </div>
        <div className="flex w-3/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      <div className="flex justify-end ">
        <div className="w-4/12">
          <InputComponent />
        </div>
      </div>
      {histories && (
        <DataTables
          columns={requestOnlineColumns}
          data={histories?.data}
          filterBy="nik"
          type="request"
        />
      )}
    </section>
  );
};

export default RequestOnline;
