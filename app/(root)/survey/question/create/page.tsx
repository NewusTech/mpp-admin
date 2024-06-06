"use client";

import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreateQuestion = () => {
  const [inputs, setInputs] = useState([
    { id: 0, element: <InputComponent key={0} /> },
  ]);

  const handleAddInput = () => {
    const newInput = {
      id: inputs.length,
      element: <InputComponent key={inputs.length} />,
    };
    setInputs([...inputs, newInput]);
  };

  const handleRemoveInput = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/survey/question">
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
        <h1 className="text-xl font-semibold">Survey Kepuasan Masyarakat</h1>
        {inputs.map((input) => (
          <div key={input.id} className="space-y-2 mt-4">
            <p className="text-sm">Pertanyaan</p>
            {input.element}
            <div className="flex justify-end mt-3">
              <div
                className="cursor-pointer"
                onClick={() => handleRemoveInput(input.id)}
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
          onClick={handleAddInput}
          className="border border-primary-700 bg-neutral-50 text-primary-700 hover:bg-primary-700 hover:text-neutral-50 w-[140px] rounded-full mt-10"
        >
          Tambah
        </Button>
      </div>
      <div className="text-right mt-8 mb-[46px]">
        <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
          Simpan
        </Button>
      </div>
    </section>
  );
};

export default CreateQuestion;
