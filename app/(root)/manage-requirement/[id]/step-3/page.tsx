"use client";

import InputComponent from "@/components/InputComponent";
import Step from "@/components/Steps";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { CardTypeFile } from "@/types/interface";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader } from "lucide-react";
import useUpdateRequirementStore from "@/lib/store/useUpdateRequirementStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const steps = [
  { id: 1, title: "1" },
  { id: 2, title: "2" },
  { id: 3, title: "3" },
];
const currentStep = 3;

const CreateManageRequirementPageStep3 = () => {
  const { serviceId } = useUpdateRequirementStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const { data: service } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/docs/${serviceId}`,
    fetcher,
  );
  const [cards, setCards] = useState<CardTypeFile[]>([]);

  const result = service?.data;
  const docs = result?.Layananforms;

  useEffect(() => {
    const initialCards = docs?.map((item: any) => ({
      id: item.id,
      field: item.field,
      tipedata: item.tipedata,
      isrequired: item.isrequired ? "1" : "0",
    }));
    setCards(initialCards);
  }, [docs]);

  const handleSwitch = (id: number) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, toggle: !card.toggle } : card,
      ),
    );
  };

  const handleRemoveCard = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layananform/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      const data = await response.json();

      const updatedCards = cards.filter((card) => card.id !== id);
      if (response.ok) {
        toast(data.message);
        setCards(updatedCards);
      }

      if (!response.ok) {
        toast("Tidak bisa dihapus, karena sudah ada yang mengisi");
      }
    } catch (error: any) {
      console.error("Error deleting card:", error);
      toast(error.message);
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card,
      ),
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const requestData = cards.map((card) => ({
      id: card.id,
      field: card.field,
      isrequired: card.isrequired,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layanandocs/updatemulti`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(requestData),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        router.push("/manage-requirement");
        setCards([]);
        localStorage.removeItem("requirement-update");
      }
    } catch (error) {
      toast("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Staff Instansi"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href={`/manage-requirement/${serviceId}/step-2`}>
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="space-y-3 justify-center">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Dokumen</p>
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
          {cards?.map((card) => (
            <div
              key={card.id}
              className="w-full h-full rounded-[20px] bg-neutral-200 p-8"
            >
              <InputComponent
                typeInput="formInput"
                value={card.field}
                onChange={(e) =>
                  handleInputChange(card.id, "field", e.target.value)
                }
              />
              <div className="space-y-2 text-sm text-neutral-900">
                <p>Apakah wajib diisi?</p>
                <RadioGroup
                  onValueChange={(e) =>
                    handleInputChange(card.id, "isrequired", parseInt(e))
                  }
                  defaultValue={card?.isrequired}
                  className="flex space-x-1"
                >
                  <div className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="1" />
                    <p className="font-normal">Ya</p>
                  </div>
                  <div className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="0" />
                    <p className="font-normal">Tidak</p>
                  </div>
                </RadioGroup>
              </div>
              {/*<div className="mt-8">*/}
              {/*  <div className="flex items-center gap-x-4">*/}
              {/*    <p className="text-sm text-neutral-900">*/}
              {/*      Hanya izinkan dengan file tertentu*/}
              {/*    </p>*/}
              {/*    <Switch*/}
              {/*      onClick={() => handleSwitch(card.id)}*/}
              {/*      className="data-[state=checked]:bg-neutral-800 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border data-[state=unchecked]:border-neutral-800"*/}
              {/*      thumbClassName="data-[state=unchecked]:border data-[state=unchecked]:border-neutral-800 data-[state=unchecked]:ml-[2px]"*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*  {card.toggle && (*/}
              {/*    <div className="w-[321px] flex mt-6">*/}
              {/*      <InputComponent typeInput="radio" />*/}
              {/*    </div>*/}
              {/*  )}*/}
              {/*</div>*/}
              <div className="flex justify-end mt-3">
                <div
                  className="cursor-pointer"
                  onClick={() => handleRemoveCard(card.id)}
                >
                  <Image
                    src="/icons/trash.svg"
                    alt="trash"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center pt-8">
            <Button
              onClick={handleSubmit}
              className="bg-primary-700 hover:bg-primary-800 rounded-full w-[290px]"
              disabled={isLoading ? true : false}
            >
              {isLoading ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateManageRequirementPageStep3;
