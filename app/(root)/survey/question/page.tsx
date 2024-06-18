"use client";

import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { surveyQuestionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useState } from "react";
import useCreateSurvey from "@/lib/store/useCreateSurvey";

const SurveyQuestion = () => {
  const [instance, setInstance] = useState<string>("");
  const setSelectedId = useCreateSurvey((state) => state.setSelectedId);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  const { data: surveys } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/survey/form/${instanceId}`,
    fetcher,
  );

  const result = data?.data;
  const surveyAll = surveys?.data?.Surveyforms;

  const handlePassIdInstnace = (id: number) => {
    setSelectedId(id);
  };

  return (
    <section className="mr-16">
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
          <InputComponent
            typeInput="select"
            value={instance}
            onChange={(e) => setInstance(e)}
            items={result}
            label="Instansi"
            placeholder="Pilih Instansi"
          />
        </div>
        {instance ? (
          <Link href="/survey/question/create">
            <Button
              onClick={() => handlePassIdInstnace(instanceId)}
              className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
            >
              Tambah
            </Button>
          </Link>
        ) : (
          <Button
            disabled={true}
            onClick={() => handlePassIdInstnace(instanceId)}
            className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
          >
            Tambah
          </Button>
        )}
      </div>
      {surveyAll && (
        <DataTables
          columns={surveyQuestionColumns}
          data={surveyAll}
          filterBy="field"
          type="requirement"
        />
      )}
    </section>
  );
};

export default SurveyQuestion;
