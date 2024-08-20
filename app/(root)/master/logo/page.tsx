import { logoColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { Logo } from "@/types/type";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertDialogCreateLogo from "@/app/(root)/master/logo/DialogForm";

async function getData(): Promise<Logo> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logo/get`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

const MasterLogo = async () => {
  const data: any = await getData();
  const result: Logo[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="flex justify-end mb-8">
          <AlertDialogCreateLogo />
        </div>
        <DataTables columns={logoColumns} data={result} filterBy="logo_mpp" />
      </section>
    </ProtectedRoute>
  );
};

export default MasterLogo;
