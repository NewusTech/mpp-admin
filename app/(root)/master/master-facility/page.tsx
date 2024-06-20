import InputComponent from "@/components/InputComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { facilitiesColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { Facility } from "@/types/type";
import AlertDialogCreateFacility from "@/app/(root)/master/master-facility/DialogForm";

async function getData(): Promise<Facility[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/facilities/get?limit=1000000`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterFacility = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-end mb-8">
        <AlertDialogCreateFacility />
      </div>
      <DataTables columns={facilitiesColumns} data={data} filterBy="image" />
    </section>
  );
};

export default MasterFacility;
