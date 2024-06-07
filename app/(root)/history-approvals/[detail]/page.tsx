import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModalValidate from "@/components/Dialog/modal-validate";
import InputComponent from "@/components/InputComponent";
import { AlertDialogPopup } from "@/components/Dialog";

const DetailHistoryApproval = () => {
  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/request/online">
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
        <h1 className="text-xl font-semibold mb-1">Nama</h1>
        <h4 className="text-[16px] text-neutral-900">Jenis Layanan</h4>
        <h2 className="text-lg font-semibold my-5">Formulir</h2>
        <div className="space-y-2">
          <p>Judul / Pertanyaan</p>
          <div className="w-full rounded-[20px] bg-neutral-50 border border-neutral-700 p-4">
            <p className="text-neutral-700">Jawaban</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold my-5">Dokumen</h2>
        <div className="space-y-2">
          <p>Judul / Pertanyaan</p>
          <Button className="w-[12%] rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-around items-center">
            <Image
              src="/icons/download.svg"
              alt="download"
              width={24}
              height={24}
            />
            <p className="text-neutral-900">Dokumen</p>
          </Button>
        </div>
        <h2 className="text-lg font-semibold my-5">Dokumen Hasil Permohonan</h2>
        <Button className="w-[12%] rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-around items-center">
          <Image
            src="/icons/download.svg"
            alt="download"
            width={24}
            height={24}
          />
          <p className="text-neutral-900">Dokumen</p>
        </Button>
      </div>
    </section>
  );
};

export default DetailHistoryApproval;
