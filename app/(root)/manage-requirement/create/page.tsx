"use client";

import InputComponent from "@/components/InputComponent";
import Step from "@/components/Steps";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useCreateRequirement from "@/lib/store/useCreateRequirement";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const steps = [
  { id: 1, title: "1" },
  { id: 2, title: "2" },
  { id: 3, title: "3" },
];
const currentStep = 1;

const CreateManageRequirementPage = () => {
  const { selectedId, serviceId, setServiceId } = useCreateRequirement(
    (state) => ({
      selectedId: state.selectedId,
      serviceId: state.serviceId,
      setServiceId: state.setServiceId,
    }),
  );
  const [informationService, setInformationService] = useState("");

  const { data: services } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/dinas/get/${selectedId}`,
    fetcher,
  );

  const serviceAll = services?.data;

  const handleSelectChange = (e: any) => {
    const selectedServiceId = e;
    setServiceId(selectedServiceId);

    // Find the selected service to get its description
    const selectedService = serviceAll.find(
      (service: any) => service.id === parseInt(selectedServiceId),
    );

    if (selectedService) {
      setInformationService(selectedService.desc);
    }
  };

  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Staff Instansi"]}>
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
            <InputComponent
              typeInput="select"
              value={serviceId}
              onChange={(e) => handleSelectChange(e)}
              items={serviceAll}
              label="Jenis Layanan"
              placeholder="Pilih Jenis Layanan"
            />
          </div>
          <div className="space-y-2">
            <p>Informasi Layanan</p>
            <InputComponent
              typeInput="textarea"
              disable={true}
              value={informationService}
            />
          </div>
          <div className="flex justify-center items-center pt-8">
            <Link href="/manage-requirement/create/step-2">
              <Button className="bg-primary-700 hover:bg-primary-800 rounded-full w-[290px]">
                Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateManageRequirementPage;
