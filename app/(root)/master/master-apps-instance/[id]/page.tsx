import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppsInstances from "@/components/Form/AppsInstance";

async function getDataBySlug(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/apkinstansi/get/id/${id}`,
    {
      cache: "no-cache",
    },
  );
  const data = await res.json();
  return data.data;
}

const EditAppInstance = async ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  const data = await getDataBySlug(params.id);

  return (
    <ProtectedRoute roles={["Admin Instansi", "Admin Verifikasi"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/master/master-apps-instance">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="-mt-[78px]">
          <h1 className="text-2xl text-primary-700 font-bold">
            Ubah Aplikasi Dinas
          </h1>
          <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
            <h1 className="text-xl font-semibold mb-4">Aplikasi Dinas</h1>
            <AppsInstances data={data} label="Ubah" />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default EditAppInstance;
