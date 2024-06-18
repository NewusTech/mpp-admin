"use client";

import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { surveyResultColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { useState } from "react";

const SurveyResult = () => {
  const [instance, setInstance] = useState<string>("");
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/get`,
    fetcher,
  );

  const instanceId = Number(instance);

  const { data: resultSurvey } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/historysurvey?instansi_id=${instanceId}`,
    fetcher,
  );

  const result = data?.data;
  const surveys = resultSurvey?.data;

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
      </div>
      {surveys && (
        <DataTables
          columns={surveyResultColumns}
          data={surveys}
          filterBy="layanan_name"
          type="requirement"
        />
      )}
    </section>
  );
};

export default SurveyResult;
