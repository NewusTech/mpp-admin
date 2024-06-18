import { FAQColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { FAQ } from "@/types/type";
import AlertDialogCreateFaq from "@/app/(root)/master/master-faq/DialogForm";

async function getData(): Promise<FAQ[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/faq/get`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

const MasterFAQ = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <AlertDialogCreateFaq />
      </div>
      <DataTables columns={FAQColumns} data={data} filterBy="question" />
    </section>
  );
};

export default MasterFAQ;
