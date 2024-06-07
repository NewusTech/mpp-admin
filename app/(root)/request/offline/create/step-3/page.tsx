import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";

const CreateOfflineStep3 = () => {
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
      <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-8 p-8">
        <h1 className="text-xl font-semibold mb-4">Dokumen</h1>
        <div className="flex items-center justify-between w-full rounded-[20px] py-6 px-4 bg-neutral-50">
          <div className="w-11/12 space-y-2">
            <h3 className="font-semibold text-[16px] text-primary-800">
              Nama Dokumen
            </h3>
            <p className="text-sm">Lorem ipsum dolor sit amet</p>
          </div>
          <div className="w-[8%]">
            <InputComponent typeInput="upload" />
          </div>
        </div>
        <div className="text-right mt-5">
          <Link href="/request/offline/create/step-3">
            <Button className="bg-success-700 hover:bg-primary-800 w-[140px] rounded-full">
              Validasi
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default CreateOfflineStep3;
