import Link from "next/link";
import Image from "next/image";
import Apps from "@/components/Form/Apps";

const CreateApps = () => {
  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/master-apps">
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
          Tambah Aplikasi Dinas
        </h1>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
          <h1 className="text-xl font-semibold mb-4">Berita</h1>
          <Apps type="create" />
        </div>
      </div>
    </section>
  );
};

export default CreateApps;
