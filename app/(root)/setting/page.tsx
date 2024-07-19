"use client";

import Image from "next/image";
import Link from "next/link";
import InputComponent from "@/components/InputComponent";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const SettingPage = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [searchTermInstance, setSearchTermInstance] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);

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
    fetcher
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTermInstance(searchInputInstance);
      setSearchTermService(searchInputService);
    }, 300); // Debounce time to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchInputInstance, searchInputService]);

  const result = data?.data;
  const serviceAll = services?.data;

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Admin Layanan"]}>
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
        {role === "Superadmin" ? (
          <div>
            {instansiId && serviceId ? (
              <div className="w-[270px] h-[260px] rounded-[10px] bg-primary-700 hover:bg-primary-800 duration-300 transition-colors">
                <Link href={`/setting/${serviceId}`}>
                  <div className="w-full h-full space-y-8 flex flex-col items-center justify-center">
                    <Image
                      src="/icons/letter.svg"
                      alt="Surat"
                      width={100}
                      height={100}
                    />
                    <p className="text-xl font-semibold text-neutral-50">
                      Format Surat
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="w-[270px] h-[260px] rounded-[10px] bg-primary-600">
                <div className="w-full h-full space-y-8 flex flex-col items-center justify-center">
                  <Image
                    src="/icons/letter.svg"
                    alt="Surat"
                    width={100}
                    height={100}
                  />
                  <p className="text-xl font-semibold text-neutral-50">
                    Format Surat
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {serviceId ? (
              <div className="w-[270px] h-[260px] rounded-[10px] bg-primary-700 hover:bg-primary-800 duration-300 transition-colors">
                <Link href={`/setting/${serviceId}`}>
                  <div className="w-full h-full space-y-8 flex flex-col items-center justify-center">
                    <Image
                      src="/icons/letter.svg"
                      alt="Surat"
                      width={100}
                      height={100}
                    />
                    <p className="text-xl font-semibold text-neutral-50">
                      Format Surat
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="w-[270px] h-[260px] rounded-[10px] bg-primary-600">
                <div className="w-full h-full space-y-8 flex flex-col items-center justify-center">
                  <Image
                    src="/icons/letter.svg"
                    alt="Surat"
                    width={100}
                    height={100}
                  />
                  <p className="text-xl font-semibold text-neutral-50">
                    Format Surat
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {/*<div className="w-[270px] h-[260px] rounded-[10px] bg-primary-700 hover:bg-primary-800 duration-300 transition-colors">*/}
        {/*  <Link href={`/setting/${serviceId}`}>*/}
        {/*    <div className="w-full h-full space-y-8 flex flex-col items-center justify-center">*/}
        {/*      <Image*/}
        {/*        src="/icons/letter.svg"*/}
        {/*        alt="Surat"*/}
        {/*        width={100}*/}
        {/*        height={100}*/}
        {/*      />*/}
        {/*      <p className="text-xl font-semibold text-neutral-50">*/}
        {/*        Format Surat*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </section>
    </ProtectedRoute>
  );
};

export default SettingPage;
