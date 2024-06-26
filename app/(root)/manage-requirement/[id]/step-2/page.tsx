"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { selectDataTypeForm } from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardType, OptionType } from "@/types/interface";
import { Input } from "@/components/ui/input";
import InputComponent from "@/components/InputComponent";
import Step from "@/components/Steps";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useUpdateRequirementStore from "@/lib/store/useUpdateRequirementStore";

const steps = [
  { id: 1, title: "1" },
  { id: 2, title: "2" },
  { id: 3, title: "3" },
];
const currentStep = 2;

const UpdateManageRequirementPageStep2 = () => {
  const router = useRouter();
  const { serviceId, layananforms, dataStep2, setDataStep2 } =
    useUpdateRequirementStore();

  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    const initialCards = layananforms.map((item) => ({
      id: item.id,
      field: item.field,
      tipedata: item.tipedata,
      isrequired: item.isrequired,
      options:
        (item.tipedata === "radio" || item.tipedata === "checkbox") &&
        item.datajson
          ? item.datajson.map((opt: any) => ({ id: opt.id, key: opt.key }))
          : [],
    }));
    setCards(initialCards);
  }, [layananforms]);

  const [lastOptionId, setLastOptionId] = useState<number>(0); // State for incremental option ID

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
        setDataStep2(updatedCards);
      }

      if (!response.ok) {
        toast("Tidak bisa dihapus, karena sudah ada yang mengisi");
      }
    } catch (error: any) {
      console.error("Error deleting card:", error);
      toast(error.message);
    }
  };

  const handleCardChange = (
    id: number,
    field: keyof CardType,
    value: string | number | OptionType[],
  ) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card,
      ),
    );
  };

  const addOption = (cardId: number) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId &&
      (card.tipedata === "radio" || card.tipedata === "checkbox")
        ? {
            ...card,
            options: [
              ...(card.options || []),
              { id: (card.options?.length || 0) + 1, key: "" },
            ],
          }
        : card,
    );
    setCards(updatedCards);
  };

  const removeOption = (cardId: number, optionId: number) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            options: card.options
              ?.filter((option) => option.id !== optionId)
              ?.map((option, index) => ({ ...option, id: index + 1 })), // Reassign IDs starting from 1
          }
        : card,
    );
    setCards(updatedCards);
  };

  const handleOptionChange = (
    cardId: number,
    optionId: number,
    value: string,
  ) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            options: card.options?.map((option) =>
              option.id === optionId ? { ...option, key: value } : option,
            ),
          }
        : card,
    );
    setCards(updatedCards);
  };

  useEffect(() => {
    setDataStep2(cards);
  }, [cards, setDataStep2]);

  const handleSubmit = async () => {
    const formattedData = dataStep2.map((card) => {
      const formattedCard: any = {
        id: card.id,
        field: card.field,
        tipedata: card.tipedata,
        isrequired: card.isrequired,
        status: 1,
      };

      if (card.tipedata === "radio" || card.tipedata === "checkbox") {
        formattedCard.datajson = card.options?.map((option) => ({
          id: option.id,
          key: option.key,
        }));
      }

      return formattedCard;
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/layananform/updatemulti`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formattedData),
        },
      );
      const responseData = await response.json();
      if (response.ok) {
        toast(responseData.message);
        router.push(`/manage-requirement/${serviceId}/step-3`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href={`/manage-requirement/${serviceId}`}>
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="space-y-3 justify-center rounded-[20px] bg-neutral-100 p-8">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">Formulir</p>
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
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-full h-full rounded-[20px] bg-neutral-200 p-8"
          >
            <div className="flex gap-x-10 items-end">
              <div className="w-8/12">
                <InputComponent
                  typeInput="formInput"
                  value={card.field}
                  onChange={(e) =>
                    handleCardChange(card.id, "field", e.target.value)
                  }
                />
              </div>
              <div className="w-4/12 space-y-2">
                <p className="text-sm">Tipe Pertanyaan</p>
                <Select
                  value={card.tipedata}
                  onValueChange={(e: string) =>
                    handleCardChange(card.id, "tipedata", e)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tipe Pertanyaan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipe Pertanyaan</SelectLabel>
                      {selectDataTypeForm?.map((item: any) => (
                        <SelectItem key={item.id} value={item.value}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div className="space-y-2 text-sm text-neutral-900">
                <p>Apakah wajib diisi?</p>
                <RadioGroup
                  onValueChange={(e) =>
                    handleCardChange(card.id, "isrequired", parseInt(e))
                  }
                  value={
                    card.isrequired || card.isrequired === true ? "1" : "0"
                  }
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
            {/* Menampilkan opsi tambahan jika tipedata adalah radio atau checkbox */}
            {(card.tipedata === "radio" || card.tipedata === "checkbox") && (
              <div className="mt-4 space-y-2">
                <p className="text-sm">Pilihan</p>
                {card.options?.map((option) => (
                  <div key={option.id} className="flex gap-x-3 items-center">
                    <Input
                      type="text"
                      className="rounded-full w-2/12"
                      value={option.key}
                      onChange={(e) =>
                        handleOptionChange(card.id, option.id, e.target.value)
                      }
                      placeholder={`Pilihan ${option.id}`}
                    />
                    <div
                      className="cursor-pointer group"
                      onClick={() => removeOption(card.id, option.id)}
                    >
                      <X className="text-error-500 group-hover:text-error-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-center items-center pt-8">
          <Button
            className="bg-primary-700 hover:bg-primary-800 rounded-full w-[290px]"
            onClick={handleSubmit}
          >
            Lanjut
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpdateManageRequirementPageStep2;
