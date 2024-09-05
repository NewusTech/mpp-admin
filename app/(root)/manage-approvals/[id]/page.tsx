"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import AlertDialogUploadFile from "@/app/(root)/history-approvals/[id]/DialogForm";
import {
  bloodTypes,
  educations,
  genders,
  marriedStatus,
  religions,
} from "@/constants";
import { UserInfoLeft, UserInfoRight } from "@/components/BiodataUser";
import ProtectedRoute from "@/components/ProtectedRoute";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import AlertDialogUploadSertif from "@/app/(root)/manage-approvals/[id]/DialogForm";

interface JwtPayload {
  permission: string[];
}

const DetailApproval = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/detail/${params.id}`,
    fetcher,
  );
  const [permission, setPermission] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSertif, setIsLoadingSertif] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);
        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.permission) {
          setPermission(decoded.permission);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const result = data?.data;
  const userInfo = result?.userinfo;
  const serviceForm = result?.Layananforminputs;
  const religion =
    religions.find((item: any) => item.id === userInfo?.agama)?.key ||
    "Tidak Diketahui";
  const bloodType =
    bloodTypes.find((item: any) => item.id === userInfo?.goldar)?.key ||
    "Tidak Diketahui";
  const gender =
    genders.find((item: any) => item.id === userInfo?.gender)?.key ||
    "Tidak Diketahui";
  const education =
    educations.find((item: any) => item.id === userInfo?.pendidikan)?.key ||
    "Tidak Diketahui";
  const married =
    marriedStatus.find((item: any) => item.id === userInfo?.status_kawin)
      ?.key || "Tidak Diketahui";

  const filteredData = serviceForm?.filter(
    (item: any) => item.layananform_tipedata !== "file",
  );

  const filteredDataFile = serviceForm?.filter(
    (item: any) => item.layananform_tipedata === "file",
  );

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/surat/${result?.layanan_id}/${result?.id}`,
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
      a.download = "surat.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil download surat",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal download surat",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCert = async () => {
    setIsLoadingSertif(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/sertif/${result?.layanan_id}/${result?.id}`,
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
      a.download = "dokumen-hasil.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil download surat",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal download surat",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoadingSertif(false);
    }
  };

  const handleValidationStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/updatestatus/${result?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            status: 2,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        router.push("/manage-approvals");
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute
      roles={[
        "Admin Instansi",
        "Super Admin",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/manage-approvals">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
          <h1 className="text-xl font-semibold mb-1">
            {result?.layanan?.Instansi?.name}
          </h1>
          <h4 className="text-[16px] text-neutral-900">
            {result?.layanan?.name}
          </h4>
          <h2 className="text-lg font-semibold my-5">Data Diri</h2>
          <div className="w-full flex">
            <div className="space-y-3 w-1/2">
              <UserInfoLeft
                userInfo={userInfo}
                religion={religion}
                gender={gender}
              />
            </div>
            <div className="space-y-3 w-1/2">
              <UserInfoRight
                userInfo={userInfo}
                education={education}
                marriedStatus={married}
                bloodType={bloodType}
              />
            </div>
          </div>
          <h2 className="text-lg font-semibold my-5">
            Formulir {result?.layanan?.name}
          </h2>
          {filteredData?.map((v: any) => (
            <div className="space-y-2 mt-3" key={v.id}>
              <p className="font-medium">{v.layananform_name}</p>
              <div className="w-full rounded-[20px] bg-neutral-50 border border-neutral-700 p-4">
                {v.layananform_tipedata === "radio" ? (
                  <p className="text-neutral-800">{v.data_key}</p>
                ) : v.layananform_tipedata === "checkbox" ? (
                  v.data_key.map((x: any, index: number) => (
                    <ol key={index} className="text-neutral-800 prose">
                      <li className="flex items-center space-x-1">
                        <span className="w-[0.4rem] h-[0.4rem] bg-neutral-800 rounded-full"></span>
                        <p>{x}</p>
                      </li>
                    </ol>
                  ))
                ) : (
                  <p className="text-neutral-800">{v.data}</p>
                )}
              </div>
            </div>
          ))}
          <h2 className="text-lg font-semibold my-5">Dokumen</h2>
          {filteredDataFile?.map((v: any) => (
            <div className="space-y-2 mt-3" key={v.id}>
              <p>{v.layananform_name}</p>
              <Link
                href={v.data}
                target="_blank"
                className="mt-2 w-full rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-start space-x-2 items-center"
              >
                <Image
                  src="/icons/download.svg"
                  alt="download"
                  width={24}
                  height={24}
                />
                <p className="text-neutral-900 truncate">Klik untuk melihat</p>
              </Link>
              <p className="text-xs">
                Pastikan <span className="font-bold">{v.layananform_name}</span>{" "}
                sudah benar
              </p>
            </div>
          ))}
          {permission.includes("Setujui Permohonan") && (
            <>
              <h2 className="text-lg font-semibold my-5">
                Upload Hasil Dokumen Permohonan
              </h2>
              <div className="flex space-x-5">
                <div className="flex gap-x-5 items-center">
                  <AlertDialogUploadFile id={params.id} />
                  <div onClick={handleDownload} className="cursor-pointer">
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <p className="underline text-[#3A28FF] text-sm">
                        Unduh Surat
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-x-5 items-center">
                  <AlertDialogUploadSertif id={params.id} />
                  <div onClick={handleDownloadCert} className="cursor-pointer">
                    {isLoadingSertif ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <p className="underline text-[#3A28FF] text-sm">
                        Unduh Dokumen Hasil
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs mt-5">
              Status permohonan
              {result?.status === 0 ? (
                <span className="bg-secondary-700 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  masih menunggu
                </span>
              ) : result?.status === 1 ? (
                <span className="bg-primary-700 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  sudah divalidasi
                </span>
              ) : result?.status === 2 ? (
                <span className="bg-primary-800 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  sudah disetujui
                </span>
              ) : result?.status === 3 ? (
                <span className="bg-success-700 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  sudah selesai
                </span>
              ) : result?.status === 4 ? (
                <span className="bg-error-700 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  ditolak
                </span>
              ) : result?.status === 5 ? (
                <span className="bg-warning-700 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  harus diperbaiki
                </span>
              ) : (
                <span className="bg-neutral-800 px-3 py-1 ml-2 text-neutral-50 rounded-full">
                  {" "}
                  sudah diperbaiki
                </span>
              )}
            </p>
            {permission.includes("Setujui Permohonan") && (
              <Button
                onClick={handleValidationStatus}
                className="bg-success-700 hover:bg-success-800 w-[140px] rounded-full"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Setujui"}
              </Button>
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default DetailApproval;
