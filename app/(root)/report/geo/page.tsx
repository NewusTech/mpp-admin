"use client";

import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import { Report as Reports } from "@/types/type";
import { geoColumn, reportProbColumns } from "@/constants";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Swal from "sweetalert2";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  layanan_id: number;
}

const ReportGeo = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [village, setVillage] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState(""); // State for search input
  const [searchTermService, setSearchTermService] = useState("");
  const [searchInputService, setSearchInputService] = useState(""); // State for search input
  const [searchTermDistrict, setSearchTermDistrict] = useState("");
  const [searchInputDistrict, setSearchInputDistrict] = useState(""); // State for search input
  const [searchTermVillage, setSearchTermVillage] = useState("");
  const [searchInputVillage, setSearchInputVillage] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [layananId, setLayananId] = useState<number | null>(null);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input
  const now = new Date();

  const firstDayOfYear = new Date(now.getFullYear(), 0, 1); // 0 berarti Januari
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfYear);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          setLayananId(decoded.layanan_id);
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

  if (role === "Admin Instansi" || role === "Admin Layanan") {
    url += `/${instansiId}?search=${searchTermService}`;
  } else {
    url += `/${instanceId}?search=${searchTermService}`;
  }

  const { data: services } = useSWR(url, fetcher);

  const serviceId = Number(service);

  const { data: kecamatan } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/kecamatan/get?search=${searchTermDistrict}`,
    fetcher
  );

  const { data: desa } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/desa/get?search=${searchTermVillage}&kecamatan_id=${district}`,
    fetcher
  );

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

  let instanceId2: any;
  let serviceId2: any;
  let additionalParams: Record<string, any> = {
    limit: 10000000,
    desa: village,
    kecamatan: district,
  };

  if (role === "Admin Layanan") {
    serviceId2 = layananId;
  } else {
    serviceId2 = serviceId;
  }

  // Mengatur instanceId2 dan serviceId2 berdasarkan role
  if (role === "Admin Instansi") {
    instanceId2 = instansiId;
    serviceId2 = serviceId2; // Jika "Admin Instansi", serviceId2 berasal dari instansiId
  } else if (role === "Admin Layanan" || role === "Admin Verifikasi") {
    instanceId2 = instansiId;
    serviceId2 = layananId;
  } else {
    instanceId2 = instanceId;
    serviceId2 = serviceId;
  }

  // Menentukan additionalParams berdasarkan kondisi service
  // Efek untuk mengosongkan service saat instanceId2 berubah
  useEffect(() => {
    setService(""); // Kosongkan service saat instanceId2 berubah
  }, [instanceId2]);

  // Menentukan additionalParams berdasarkan kondisi service dan instanceId2
  if (service !== "") {
    // Jika ada service, kirim layanan saja
    additionalParams = {
      ...additionalParams,
      instansi: "", // Kosongkan instansi
      layanan: service, // Kirim layanan dengan nilai service
    };
  } else {
    // Jika service kosong atau instanceId2 berubah, kirim instansi saja
    additionalParams = {
      ...additionalParams,
      instansi: instanceId2, // Kirim instansi
      layanan: "", // Kosongkan layanan
    };
  }

  // Pastikan startDate dan endDate dalam format yang benar
  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const params = {
    ...additionalParams,
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/reportgeolayanan`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: reports } = useSWR<any>(fixUrl, fetcher);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Tentukan URL berdasarkan kondisi service dan instanceId2
      let downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/pdf-reportgeolayanan?`;

      // Jika service kosong, hanya kirim instansi
      if (service === "") {
        downloadUrl += `instansi=${instanceId2}&desa=${village}&kecamatan=${district}`;
      } else {
        // Jika ada service, hanya kirim layanan
        downloadUrl += `layanan=${serviceId2}&desa=${village}&kecamatan=${district}`;
      }

      // Lakukan permintaan fetch untuk mengunduh laporan
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan-geo.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil download",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal download!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
      setSearchTermService(searchInputService);
      setSearchTermDistrict(searchInputDistrict);
      setSearchTermVillage(searchInputVillage);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchInputInstance,
    searchInputService,
    searchInputDistrict,
    searchInputVillage,
  ]);

  const result = data?.data;
  const districtResult = kecamatan?.data;
  const villageResult = desa?.data;
  const report = reports?.data;

  return (
    <ProtectedRoute
      roles={["Super Admin", "Admin Instansi", "Admin Verifikasi", "Admin Layanan"]}
    >
      <section className="mr-16">
        <div className="flex justify-between gap-x-5 mb-8">
          <div className="flex w-full gap-x-5 ">
            {role !== "Admin Instansi" &&
              role !== "Admin Layanan" &&
              role !== "Admin Verifikasi" && (
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
            {role !== "Admin Layanan" && (
              <InputComponent
                typeInput="selectSearch"
                items={services?.data}
                valueInput={searchInputService}
                onChangeInputSearch={(e) =>
                  setSearchInputService(e.target.value)
                }
                label="Layanan"
                placeholder="Pilih Layanan"
                value={service}
                onChange={(e: any) => setService(e)}
              />
            )}
            <InputComponent
              typeInput="selectSearch"
              items={districtResult}
              valueInput={searchInputDistrict}
              onChangeInputSearch={(e) =>
                setSearchInputDistrict(e.target.value)
              }
              label="Kecamatan"
              placeholder="Pilih Kecamatan"
              value={district}
              onChange={(e: any) => setDistrict(e)}
            />
            <InputComponent
              typeInput="selectSearch"
              items={villageResult}
              valueInput={searchInputVillage}
              onChangeInputSearch={(e) => setSearchInputVillage(e.target.value)}
              label="Desa"
              placeholder="Pilih Desa"
              value={village}
              onChange={(e: any) => setVillage(e)}
            />
          </div>
        </div>
        <div className={`flex pl-[24.5rem] w-full gap-x-2 mb-8`}>
          {/* <div className="flex items-center gap-x-2 w-5/12">
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
          </div> */}
          <Button
            onClick={handleDownload}
            className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <Image
                  src="/icons/printer.svg"
                  alt="print"
                  width={24}
                  height={24}
                />
                Print
              </>
            )}
          </Button>
        </div>
        {report && (
          <DataTables columns={geoColumn} data={report} filterBy="name" />
        )}
      </section>
    </ProtectedRoute>
  );
};

export default ReportGeo;
