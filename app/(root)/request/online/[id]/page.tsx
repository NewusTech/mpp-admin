"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModalValidate from "@/components/Dialog/modal-validate";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  bloodTypes,
  educations,
  genders,
  marriedStatus,
  religions,
} from "@/constants";
import Cookies from "js-cookie";
import { UserInfoLeft, UserInfoRight } from "@/components/BiodataUser";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ModalValidateRevision from "@/components/Dialog/modal-validate-revision";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

interface JwtPayload {
  permission: string[];
}

const DetailRequestOnline = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const router = useRouter();
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/detail/${params.id}`,
    fetcher,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<string[]>([]);

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

  const [clickedLinks, setClickedLinks] = useState(
    new Array(filteredDataFile?.length).fill(false),
  );

  // Fungsi untuk menandai link sebagai diklik
  const handleLinkClick = (index: any) => {
    const newClickedLinks = [...clickedLinks];
    newClickedLinks[index] = true;
    setClickedLinks(newClickedLinks);
  };

  // Memeriksa apakah semua link telah diklik
  const allLinksClicked = clickedLinks.every((clicked) => clicked);

  console.log(permission);

  const handleValidationStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/updatestatus/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            status: 1,
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
        router.push("/manage-approvals?tabs=online");
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
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute
      roles={[
        "Super Admin",
        "Admin Instansi",
        "Admin Layanan",
        "Admin Verifikasi",
      ]}
    >
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/request/online">
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
          {filteredDataFile?.map((v: any, index: any) => (
            <div className="space-y-2 mt-3" key={v.id}>
              <p>{v.layananform_name}</p>
              <Link
                href={v.data}
                target="_blank"
                className="mt-2 w-full rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-start space-x-2 items-center"
                onClick={() => handleLinkClick(index)}
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
          {permission.includes("Validasi Permohonan") && (
            <div className="text-center mt-8 mb-5 space-x-3">
              <ModalValidate
                id={params.id}
                title="Tolak"
                state={!allLinksClicked}
              />
              <ModalValidateRevision
                id={params.id}
                title="Perbaiki"
                state={!allLinksClicked}
              />
              <Button
                onClick={handleValidationStatus}
                className="bg-success-700 hover:bg-success-800 w-[140px] rounded-full"
                disabled={!allLinksClicked || isLoading}
              >
                {isLoading ? <Loader className="animate-spin" /> : "Validasi"}
              </Button>
            </div>
          )}
          <p className="text-xs">
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
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default DetailRequestOnline;
