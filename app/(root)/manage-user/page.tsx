import InputComponent from "@/components/InputComponent";
import { manageUserColumns } from "@/constants";
import { DataTables } from "@/components/Datatables";
import { AlertDialogPopup } from "@/components/Dialog";
import { ManageUser as User } from "@/types/type";

async function getData(): Promise<User[]> {
  return [
    {
      id: 1,
      name: "Aldi",
      role: "Admin",
      status: "Text",
    },
    // ...
  ];
}

const ManageUser = async () => {
  const data = await getData();
  return (
    <section className="mr-16">
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
          <InputComponent />
        </div>
        <AlertDialogPopup
          title="Tambah"
          style="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full"
          header="Tambah User"
          content={
            <>
              <div className="pt-6 px-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="font-normal">Nama</p>
                    <InputComponent />
                  </div>
                  <div className="space-y-2">
                    <p className="font-normal">Email</p>
                    <InputComponent />
                  </div>
                  <div className="space-y-2">
                    <p className="font-normal">Role</p>
                    <InputComponent />
                  </div>
                  <div className="space-y-2">
                    <p className="font-normal">Status</p>
                    <InputComponent typeInput="select" />
                  </div>
                </div>
              </div>
            </>
          }
        />
      </div>
      <DataTables columns={manageUserColumns} data={data} />
    </section>
  );
};

export default ManageUser;
