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
interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const SettingPage = () => {
  const [instance, setInstance] = useState<string>("");
  const [service, setService] = useState<string>("");
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

  const result = data?.data;
  const serviceAll = services?.data;

  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-full gap-x-5">
          {role !== "Admin Instansi" && (
            <InputComponent
              typeInput="select"
              value={instance}
              onChange={(e) => setInstance(e)}
              items={result}
              label="Instansi"
              placeholder="Pilih Instansi"
            />
          )}
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
  );
};

export default SettingPage;
