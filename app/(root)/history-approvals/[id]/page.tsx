"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  bloodTypes,
  educations,
  genders,
  marriedStatus,
  religions,
} from "@/constants";
import { UserInfoLeft, UserInfoRight } from "@/components/BiodataUser";
import ProtectedRoute from "@/components/ProtectedRoute";

const DetailHistoryApproval = ({
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

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Extract filename and extension from URL
  const getFileNameFromUrl = (url: string) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  const handleValidationStatus = async () => {
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
            status: 3,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        router.push("/history-approvals");
      }
    } catch (e: any) {
      toast(e.message);
    }
  };

  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Staff Instansi"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10 w-12 h-12">
          <Link href="/history-approvals">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
          <h1 className="text-xl font-semibold mb-1">Nama</h1>
          <h4 className="text-[16px] text-neutral-900">Jenis Layanan</h4>
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
          <h2 className="text-lg font-semibold my-5">Formulir</h2>
          {filteredData?.map((v: any) => (
            <div className="space-y-2 mt-3" key={v.id}>
              <p>{v.layananform_name}</p>
              <div className="w-full rounded-[20px] bg-neutral-50 border border-neutral-700 p-4">
                <p className="text-neutral-700">{v.data}</p>
              </div>
            </div>
          ))}
          <h2 className="text-lg font-semibold my-5">Dokumen</h2>
          {filteredDataFile?.map((v: any) => (
            <div className="space-y-2 mt-3" key={v.id}>
              <p>{v.layananform_name}</p>
              <Button
                onClick={() =>
                  handleDownload(v.data, getFileNameFromUrl(v.data))
                }
                className="mt-2 w-[25vh] space-x-3 rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-around items-center"
              >
                <Image
                  src="/icons/download.svg"
                  alt="download"
                  width={24}
                  height={24}
                />
                <p className="text-neutral-900">{v.layananform_name}</p>
              </Button>
            </div>
          ))}
          <h2 className="text-lg font-semibold my-5">
            Dokumen Hasil Permohonan
          </h2>
          <Button className="w-[25vh] rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-around items-center">
            <Image
              src="/icons/download.svg"
              alt="download"
              width={24}
              height={24}
            />
            <p className="text-neutral-900">Dokumen</p>
          </Button>
          {serviceForm.status !== 0 && serviceForm.status !== 2 ? (
            <Button
              onClick={handleValidationStatus}
              className="mt-7 w-full rounded-full bg-success-700 hover:bg-success-800"
            >
              Selesai
            </Button>
          ) : (
            <Button
              className="mt-7 w-full rounded-full bg-success-700 hover:bg-success-800"
              disabled={true}
            >
              Selesai
            </Button>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default DetailHistoryApproval;
