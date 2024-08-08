"use client";

import InputComponent from "@/components/InputComponent";
import Step from "@/components/Steps";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import useUpdateRequirementStore from "@/lib/store/useUpdateRequirementStore";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RichTextDisplay } from "@/components/RichTextDisplay";

const steps = [
  { id: 1, title: "1" },
  { id: 2, title: "2" },
  { id: 3, title: "3" },
];
const currentStep = 1;

const UpdateManageRequirementPage = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const { setLayananforms, setServiceId } = useUpdateRequirementStore(
    (state) => ({
      setLayananforms: state.setLayananforms,
      setServiceId: state.setServiceId,
    }),
  );

  const router = useRouter();

  const { data: service } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/form/${params.id}`,
    fetcher,
  );

  const serviceOne = service?.data;

  const handlePassLayananforms = () => {
    setLayananforms(serviceOne.Layananforms);
    setServiceId(params.id);
    router.push(`/manage-requirement/${params.id}/step-2`);
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
          <Link href="/manage-requirement">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="space-y-3 justify-center rounded-[20px] bg-neutral-100 p-8">
          <p className="text-lg font-semibold">Tambah Persyaratan</p>
          <div className="flex justify-end">
            <div className="flex">
              {steps.map((step, index) => (
                <Step
                  key={step.id}
                  title={step.title}
                  isLastStep={index === steps.length - 1}
                  isActive={step.id === currentStep}
                />
              ))}
            </div>
          </div>
          <div className="py-5 space-y-2">
            <p>Jenis Layanan</p>
            <InputComponent disable={true} value={serviceOne?.name} />
          </div>
          <div className="space-y-2">
            <p>Informasi Layanan</p>
            <div className="rounded-[20px] w-full h-full bg-neutral-100 border p-3 text-slate-500">
              <RichTextDisplay content={serviceOne?.desc} />
            </div>
          </div>
          <div className="flex justify-center items-center pt-8">
            <Button
              className="bg-primary-700 hover:bg-primary-800 rounded-full w-[290px]"
              onClick={handlePassLayananforms}
            >
              Lanjut
            </Button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default UpdateManageRequirementPage;
