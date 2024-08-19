"use client";

import InputComponent from "@/components/InputComponent";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { fetcher } from "@/lib/fetch";
import useSWR from "swr";
import { DataTables } from "@/components/Datatables";
import { complaintColumns, manageApprovalColumns } from "@/constants";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface JwtPayload {
  role?: string;
  instansi_id: number;
  instansi: string;
}

export default function ComplaintPage() {
  const now = new Date();

  const firstDayOfYear = new Date(now.getFullYear(), 0, 1); // 0 berarti Januari
  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfYear);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [instance, setInstance] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<any>(0);
  const [instansiName, setInstansiName] = useState<any>(0);
  const [searchInputInstance, setSearchInputInstance] = useState(""); // State for search input

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
          setInstansiName(decoded.instansi);
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

  if (
    role === "Admin Instansi" ||
    role === "Admin Layanan" ||
    role === "Admin Verifikasi"
  ) {
    instanceId2 = instansiId;
  } else {
    instanceId2 = instanceId;
  }

  const startDateFormatted = startDate
    ? formatDate(new Date(startDate))
    : undefined;
  const endDateFormatted = endDate ? formatDate(new Date(endDate)) : undefined;

  const params = {
    instansi_id: instanceId2,
    limit: 10000000, // atau false
    start_date: startDateFormatted, // atau undefined
    end_date: endDateFormatted, // atau undefined
  };
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/pengaduan/get`;

  // Bangun URL berdasarkan role dan instanceId
  const fixUrl = buildUrl(baseUrl, params);

  // Gunakan URL yang dibangun dengan useSWR
  const { data: complaint } = useSWR<any>(fixUrl, fetcher);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/pengaduan/getpdf?instansi_id=${instanceId}&start_date=${startDateFormatted}&end_date=${endDateFormatted}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report pengaduan user.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        toast("Berhasil download laporan");
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const result = data?.data;
  const resultComplaint = complaint?.data;

  return (
    <ProtectedRoute
      roles={[
        "Admin Instansi",
        "Admin Layanan",
        "Admin Verifikasi",
        "Super Admin",
      ]}
    >
      <section className="mr-16">
        <div className="flex w-full items-center gap-x-2 justify-end mb-[86px]">
          <div className="w-full">
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
            {(role === "Admin Layanan" ||
              role === "Admin Verifikasi" ||
              role === "Admin Instansi") && (
              <h1 className="text-3xl font-bold w-10/12">
                Pengaduan {instansiName}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-x-2 w-4/12">
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
            {instanceId ||
            role === "Admin Instansi" ||
            role === "Admin Layanan" ||
            role === "Admin Verifikasi" ? (
              <Button
                disabled={isLoading}
                onClick={handleDownload}
                className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
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
            ) : (
              <Button
                disabled={true}
                className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full"
              >
                <Image
                  src="/icons/printer.svg"
                  alt="print"
                  width={24}
                  height={24}
                />
                Print
              </Button>
            )}
          </div>
        </div>
        {resultComplaint && (
          <DataTables
            columns={complaintColumns}
            data={resultComplaint}
            filterBy="judul"
          />
        )}
      </section>
    </ProtectedRoute>
  );
}
