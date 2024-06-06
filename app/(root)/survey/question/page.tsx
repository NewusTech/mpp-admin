import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { columns, Payment } from "@/constants";
import { DataTables } from "@/components/Datatables";

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

const SurveyQuestion = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
          <InputComponent typeInput="select" />
        </div>
        <Link href="/survey/question/create">
          <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
            Tambah
          </Button>
        </Link>
      </div>
      <DataTables columns={columns} data={data} />
    </section>
  );
};

export default SurveyQuestion;
