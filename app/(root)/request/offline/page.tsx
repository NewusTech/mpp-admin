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
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatDate } from "@/lib/utils";

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
    fetcher
  );

  const instanceId = Number(instance);

  let url = `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get`;

  if (role === "Admin Instansi") {
    url += `/${instansiId}?search=${searchTermService}`;
  } else if ("Super Admin") {
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

  // Pastikan startDate dan endDate dalam format yang benar
  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const params = {
    instansi_id: instanceId2,
    layanan_id: serviceId,
    limit: 10000000, // atau false
    start_date: startDateFormatted, // atau undefined
    end_date: endDateFormatted, // atau undefined
    isonline: 0,
    status: 1,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/historyform`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: histories } = useSWR<any>(fixUrl, fetcher);

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
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Admin Layanan"]}>
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
    </ProtectedRoute>
  );
};

export default RequestOffline;
