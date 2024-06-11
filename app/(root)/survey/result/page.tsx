import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { surveyResultColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import { SurveyResult as Result } from "@/types/type";

async function getData(): Promise<Result[]> {
  return [
    {
      id: 1,
      service: "Layanan Aldi",
      total: "1000",
      value: "0800",
    },
    // ...
  ];
}

const SurveyResult = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
          <InputComponent typeInput="select" />
        </div>
        <Link href="/survey/result/print">
          <Button className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full">
            <Image
              src="/icons/printer.svg"
              alt="print"
              width={24}
              height={24}
            />
            Print
          </Button>
        </Link>
      </div>
      <DataTables columns={surveyResultColumns} data={data} />
    </section>
  );
};

export default SurveyResult;
