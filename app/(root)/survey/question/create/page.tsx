"use client";

import React, { ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useCreateSurvey from "@/lib/store/useCreateSurvey";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// Define the type for the API request payload
interface Payload {
  field: string;
  instansi_id: number;
}

const InputComponent = ({ value, onChange }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      className="rounded-full"
    />
  );
};

const CreateQuestion = () => {
  const { inputs, setInputs } = useCreateSurvey((state) => ({
    inputs: state.inputs,
    setInputs: state.setInputs,
  }));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedId = useCreateSurvey((state) => state.selectedId);
  const router = useRouter();

  const handleAddInput = () => {
    setInputs([...inputs, { field: "" }]);
  };

  const handleRemoveInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleChangeInput = (value: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], field: value };
    setInputs(newInputs);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const payload: Payload[] = inputs.map((input) => ({
      field: input.field,
      status: 1,
      instansi_id: selectedId,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/surveyform/createmulti`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast(result.message);
        router.push("/survey/question");
      }

      console.log(result);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Admin Layanan"]}>
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
          {inputs.map((input, index) => (
            <div key={index} className="space-y-2 mt-4">
              <p className="text-sm">Pertanyaan</p>
              <InputComponent
                value={input.field}
                onChange={(value) => handleChangeInput(value, index)}
              />
              <div className="flex justify-end mt-3">
                <div
                  className="cursor-pointer"
                  onClick={() => handleRemoveInput(index)}
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
          <Button
            onClick={handleSave}
            className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Simpan"}
          </Button>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateQuestion;
