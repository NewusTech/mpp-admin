import { contactColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Contact } from "@/types/type";
import AlertDialogCreateContact from "@/app/(root)/master/contact/DialogForm";
import ProtectedRoute from "@/components/ProtectedRoute";

async function getData(): Promise<Contact> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/contact/get`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.data;
}

const MasterContact = async () => {
  const data = await getData();
  const result: Contact[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateContact />
        </div>
        <DataTables columns={contactColumns} data={result} filterBy="alamat" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterContact;
