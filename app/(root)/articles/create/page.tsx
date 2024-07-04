"use client";

import Link from "next/link";
import Image from "next/image";
import News from "@/components/Form/News";
import ProtectedRoute from "@/components/ProtectedRoute";

const CreateArticle = () => {
  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Staff Instansi"]}>
      <section className="mr-16">
        <div className="-ml-14 mb-10">
          <Link href="/articles">
            <Image
              src="/icons/back-arrow.svg"
              alt="back-arrow"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="-mt-[78px]">
          <h1 className="text-2xl text-primary-700 font-bold">Tambah Berita</h1>
          <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
            <h1 className="text-xl font-semibold mb-4">Berita</h1>
            <News type="create" />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default CreateArticle;
