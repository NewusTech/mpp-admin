import Link from "next/link";
import Image from "next/image";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";

const CreateOfflineStep2 = () => {
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
        <div className="flex justify-between gap-x-10">
          <div className="w-full space-y-4">
            <h1 className="text-xl font-semibold mb-4">Formulir</h1>
            <div className="space-y-2">
              <p>Pertanyaan</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Pertanyaan</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Pertanyaan</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Pertanyaan</p>
              <InputComponent />
            </div>
            <div className="space-y-2">
              <p>Pertanyaan</p>
              <InputComponent />
            </div>
            <div className="text-right">
              <Link href="/request/offline/create/step-3">
                <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
                  Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CreateOfflineStep2;
