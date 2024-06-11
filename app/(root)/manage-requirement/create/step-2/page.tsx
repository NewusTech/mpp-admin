"use client";

import InputComponent from "@/components/InputComponent";
import Step from "@/components/Steps";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardType } from "@/types/interface";

const steps = [
  { id: 1, title: "1" },
  { id: 2, title: "2" },
  { id: 3, title: "3" },
];
const currentStep = 2;

const CreateManageRequirementPageStep2 = () => {
  const [cards, setCards] = useState<CardType[]>([{ id: Date.now() }]);

  const handleAddCard = () => {
    setCards([...cards, { id: Date.now() }]);
  };

  const handleRemoveCard = (id: any) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/manage-requirement/create">
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
            <div className="flex gap-x-24">
              <InputComponent typeInput="formInput" />
              <InputComponent typeInput="select" />
            </div>
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
        <Button
          className="border border-primary-700 bg-transparent text-primary-700 hover:bg-primary-700 hover:text-neutral-50 rounded-full w-[120px]"
          onClick={handleAddCard}
        >
          Tambah
        </Button>
        <div className="flex justify-center items-center pt-8">
          <Link href="/manage-requirement/create/step-3">
            <Button className="bg-primary-700 hover:bg-primary-800 rounded-full w-[290px]">
              Lanjut
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreateManageRequirementPageStep2;
