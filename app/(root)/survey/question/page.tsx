import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { surveyQuestionColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { SurveyQuestion as Question } from "@/types/type";

async function getData(): Promise<Question[]> {
  return [
    {
      id: 1,
      no: 2,
      question: "Halo",
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
      <DataTables columns={surveyQuestionColumns} data={data} />
    </section>
  );
};

export default SurveyQuestion;
