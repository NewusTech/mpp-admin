import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import { DataTables } from "@/components/Datatables";
import Image from "next/image";
import { Report as Reports } from "@/types/type";
import { reportColumns } from "@/constants";

async function getData(): Promise<Reports[]> {
  return [
    {
      id: 1,
      service: "layanan 1",
      waiting: "Text",
      failed: "Text",
      success: "text",
    },
    // ...
  ];
}

const Report = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-full gap-x-5">
          <InputComponent typeInput="select" />
          <div className="flex items-center gap-x-2">
            <InputComponent typeInput="datepicker" />
            <p>to</p>
            <InputComponent typeInput="datepicker" />
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
        </div>
      </div>
      <DataTables columns={reportColumns} data={data} />
    </section>
  );
};

export default Report;
