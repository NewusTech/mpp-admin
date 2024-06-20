"use client";

// import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import InputComponent from "@/components/InputComponent";
import { useEffect, useState } from "react";
import { requestOfflineColumns } from "@/constants";
import useCreateRequestOffline from "@/lib/store/useCreateRequestOffline";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const RequestOffline = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const setServiceId = useCreateRequestOffline((state) => state.setServiceId);
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [searchTermInstance, setSearchTermInstance] = useState("");
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

  let historyUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  if (role === "Admin Instansi" && instansiId !== null) {
    historyUrl += `?instansi_id=${instansiId}&layanan_id=${serviceId}`;
  } else if (role === "Superadmin") {
    historyUrl += `?instansi_id=${instanceId}&layanan_id=${serviceId}`;
  }

  const { data: histories } = useSWR<any>(historyUrl, fetcher);

  const handlePassId = (id: number) => {
    setServiceId(id);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
      setSearchTermService(searchInputService);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance, searchInputService]);

  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-7/12 gap-x-5">
          {role !== "Admin Instansi" && (
            <InputComponent
              typeInput="selectSearch"
              valueInput={searchInputInstance}
              onChangeInputSearch={(e) =>
                setSearchInputInstance(e.target.value)
              }
              items={data?.data}
              label="Instansi"
              placeholder="Pilih Instansi"
              value={instance}
              onChange={(e: any) => setInstance(e)}
            />
          )}
          <InputComponent
            typeInput="selectSearch"
            items={services?.data}
            valueInput={searchInputService}
            onChangeInputSearch={(e) => setSearchInputService(e.target.value)}
            label="Layanan"
            placeholder="Pilih Layanan"
            value={service}
            onChange={(e: any) => setService(e)}
          />
        </div>
        <div className="flex w-5/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      <div className="flex justify-start ">
        {role === "Superadmin" ? (
          <div>
            {instansiId && serviceId ? (
              <Link href="/request/offline/create">
                <Button
                  onClick={() => handlePassId(serviceId)}
                  className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
                >
                  Tambah
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
              >
                Tambah
              </Button>
            )}
          </div>
        ) : (
          <div>
            {serviceId ? (
              <Link href="/request/offline/create">
                <Button
                  onClick={() => handlePassId(serviceId)}
                  className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
                >
                  Tambah
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
              >
                Tambah
              </Button>
            )}
          </div>
        )}
      </div>
      {histories && (
        <DataTables
          columns={requestOfflineColumns}
          data={histories?.data}
          filterBy="nik"
          type="request"
        />
      )}
    </section>
  );
};

export default RequestOffline;
