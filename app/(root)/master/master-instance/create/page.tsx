import Link from "next/link";
import Image from "next/image";
import Instance from "@/components/Form/Instance";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateInstance() {
  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/master/master-instance">
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
            Tambah Instansi
          </h1>
          <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
            <h1 className="text-xl font-semibold mb-4">Instansi</h1>
            <Instance type="create" label="Tambah" />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
