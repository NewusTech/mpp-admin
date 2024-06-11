import InputComponent from "@/components/InputComponent";
import { requestOnlineColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { RequestOnline as Request } from "@/types/type";

async function getData(): Promise<Request[]> {
  return [
    {
      id: 1,
      date: "08-09-2012",
      name: "John Doe",
      status: "Pending",
    },
    // ...
  ];
}

const RequestOnline = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between gap-x-5 mb-8">
        <div className="flex w-9/12 gap-x-5">
          <InputComponent typeInput="select" />
          <InputComponent typeInput="select" />
        </div>
        <div className="flex w-3/12 items-center gap-x-2">
          <InputComponent typeInput="datepicker" />
          <p>to</p>
          <InputComponent typeInput="datepicker" />
        </div>
      </div>
      <div className="flex justify-end ">
        <div className="w-4/12">
          <InputComponent />
        </div>
      </div>
      <DataTables columns={requestOnlineColumns} data={data} />
    </section>
  );
};

export default RequestOnline;
