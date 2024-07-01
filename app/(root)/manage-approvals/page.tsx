"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import { manageApprovalColumns } from "@/constants";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const buttons: any = [
  { label: "Offline", value: 0 },
  { label: "Online", value: 1 },
];

const ManageApprovals = () => {
  const [activeButton, setActiveButton] = useState("");
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const [searchTermService, setSearchTermService] = useState("");
  const [searchInputService, setSearchInputService] = useState(""); // State for search input

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

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get?search=${searchTermInstance}`,
    fetcher,
  );

  const instanceId = Number(instance);

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get`;

  if (role === "Admin Instansi") {
    url += `/${instansiId}?search=${searchTermService}`;
  } else if ("Superadmin") {
    url += `/${instanceId}?search=${searchTermService}`;
  }

  const { data: services } = useSWR(url, fetcher);

  const serviceId = Number(service);

  const buildUrl = (baseUrl: string, params: Record<string, any>) => {
    const url = new URL(baseUrl);
    // Tambahkan parameter lainnya
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url.toString();
  };

  let instanceId2;

  if (role === "Admin Instansi") {
    instanceId2 = instansiId;
  } else {
    instanceId2 = instanceId;
  }

  const params = {
    instansi_id: instanceId2,
    layanan_id: serviceId,
    limit: 10000000,
    isOnline: activeButton, // atau false
    start_date: startDate, // atau undefined
    end_date: endDate, // atau undefined
    status: 1,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: histories } = useSWR<any>(fixUrl, fetcher);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
      setSearchTermService(searchInputService);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance, searchInputService]);

  const result = data?.data;
  const serviceAll = services?.data;
  const historyAll = histories?.data;

  const handleClick = (value: any) => {
    setActiveButton(value);
  };

  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-full gap-x-5">
          {role !== "Admin Instansi" && (
            <InputComponent
              typeInput="selectSearch"
              valueInput={searchInputInstance}
              onChangeInputSearch={(e) =>
                setSearchInputInstance(e.target.value)
              }
              items={result}
              label="Instansi"
              placeholder="Pilih Instansi"
              value={instance}
              onChange={(e: any) => setInstance(e)}
            />
          )}
          <InputComponent
            typeInput="selectSearch"
            items={serviceAll}
            valueInput={searchInputService}
            onChangeInputSearch={(e) => setSearchInputService(e.target.value)}
            label="Layanan"
            placeholder="Pilih Layanan"
            value={service}
            onChange={(e: any) => setService(e)}
          />
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="flex gap-x-3">
          {buttons.map((button: any) => (
            <Button
              key={button.value}
              className={`border border-primary-700 hover:bg-primary-700 hover:text-neutral-50 w-[140px] rounded-full ${
                activeButton === button.value
                  ? "bg-primary-700 text-neutral-50"
                  : "bg-transparent text-primary-700"
              }`}
              onClick={() => handleClick(button.value)}
            >
              {button.label}
            </Button>
          ))}
        </div>
        <div className="flex w-4/12 items-center gap-x-2">
          <InputComponent
            typeInput="datepicker"
            date={startDate}
            setDate={(e) => setStartDate(e)}
          />
          <p>to</p>
          <InputComponent
            typeInput="datepicker"
            date={endDate}
            setDate={(e) => setEndDate(e)}
          />
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
