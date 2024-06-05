import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";

const CreateArticle = () => {
  return (
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
          <h1 className="text-xl font-semibold">Berita</h1>
          <div className="space-y-2 mt-4">
            <p className="text-sm">Judul</p>
            <InputComponent />
          </div>
          <div className="space-y-2 mt-4">
            <p className="text-sm">Deskripsi</p>
            <InputComponent typeInput="textarea" />
          </div>
          <div className="space-y-2 mt-4">
            <p className="text-sm">Dokumen</p>
            <InputComponent typeInput="file" />
          </div>
          <div className="text-center mt-8 mb-[46px]">
            <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateArticle;
