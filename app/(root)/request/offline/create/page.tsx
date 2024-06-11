import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";

const CreateOffline = () => {
  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/request/offline">
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Cari NIK</h1>
        <div className="w-1/2">
          <InputComponent />
        </div>
        <p className="text-error-700">NIK Belum Terdaftar</p>
      </div>
      <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-8 p-8">
        <div className="flex justify-between gap-x-10">
          <div className="w-1/2 space-y-4">
            <h1 className="text-xl font-semibold mb-4">Data Diri</h1>
            <div className="space-y-2">
              <p>Nama</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>NIK</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Nomor Telepon</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Email</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Password</p>
              <InputComponent />
            </div>
          </div>
          <div className="w-1/2 space-y-4">
            <h1 className="text-xl font-semibold mb-4">Alamat</h1>
            <div className="flex gap-x-4">
              <div className="w-full space-y-2">
                <p>Kecamatan</p>
                <InputComponent />
              </div>
              <div className="w-full space-y-2">
                <p>Desa</p>
                <InputComponent />
              </div>
            </div>
            <div className="flex gap-x-4">
              <div className="w-full space-y-2">
                <p>RT</p>
                <InputComponent />
              </div>
              <div className="w-full space-y-2">
                <p>RW</p>
                <InputComponent />
              </div>
            </div>
            <div className="w-full space-y-2">
              <p>Alamat</p>
              <InputComponent typeInput="textarea" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-8 p-8">
        <div className="flex justify-between gap-x-10">
          <div className="w-full space-y-4">
            <h1 className="text-xl font-semibold mb-4">Formulir</h1>
            <div className="space-y-2">
              <p>Pertanyaan</p>
              <InputComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateOffline;
