import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { columns, Payment } from "@/constants";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      jenis: "Layanan Aldi",
      online: true,
      offline: false,
    },
    // ...
  ];
}

const SurveyPrint = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      {/*<div className="flex justify-between mb-8">*/}
      {/*  <div className="w-1/2">*/}
      {/*    <InputComponent typeInput="select" />*/}
      {/*  </div>*/}
      {/*  <Link href="/survey/result/print">*/}
      {/*    <Button className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full">*/}
      {/*      <Image*/}
      {/*        src="/icons/printer.svg"*/}
      {/*        alt="print"*/}
      {/*        width={24}*/}
      {/*        height={24}*/}
      {/*      />*/}
      {/*      Print*/}
      {/*    </Button>*/}
      {/*  </Link>*/}
      {/*</div>*/}
      <div className="-ml-14 mb-10">
        <Link href="/survey/result">
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="w-full h-full py-8 px-[64px] bg-neutral-50 shadow rounded-[20px]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Jenis Layanan</h1>
          <Button className="flex justify-around bg-transparent items-center border border-primary-700 text-primary-700 hover:bg-neutral-300 w-[140px] rounded-full">
            <Image
              src="/icons/printer.svg"
              alt="print"
              width={24}
              height={24}
            />
            Print
          </Button>
        </div>
        <DataTables columns={columns} data={data} />
      </div>
    </section>
  );
};

export default SurveyPrint;
