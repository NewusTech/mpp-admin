import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { newsColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { News } from "@/types/type";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

async function getData(): Promise<News[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/artikel/get`,
    {
      cache: "no-cache",
    },
  );
  const data = await res.json();
  return data.data;
}

const Articles = async () => {
  const data = await getData();
  console.log(data);

  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <Link href="/articles/create">
          <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
            Tambah
          </Button>
        </Link>
      </div>
      <DataTables columns={newsColumns} data={data} filterBy="title" />
    </section>
  );
};

export default Articles;
