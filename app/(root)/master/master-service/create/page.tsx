"use client";

import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import ServiceForm from "@/components/Form/Service";
import useServiceStore from "@/lib/store/useServiceStore";

const CreateServive = () => {
  const selectedId = useServiceStore((state) => state.selectedId);
  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Staff Instansi"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10 w-12 h-12">
          <Link href="/master/master-service">
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
            Tambah Layanan
          </h1>
          <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
            <h1 className="text-xl font-semibold mb-4">Layanan</h1>
            <ServiceForm type="create" label="Ubah" id={selectedId} />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateServive;

// const { data: getServiceOne } = useSWR<any>(
//   `${process.env.NEXT_PUBLIC_API_URL}/user/layanan/${params.id}`,
//   fetcher,
// );
// const result = getServiceOne?.data;
