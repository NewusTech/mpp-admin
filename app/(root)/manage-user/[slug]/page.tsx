"use client";

import Link from "next/link";
import Image from "next/image";
import UserData from "@/components/Form/User/page";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

const UpdateUserData = ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/alluserinfo/get/${params.slug}`,
    fetcher,
  );

  const result = data?.data;

  console.log(data);

  return (
    <section className="mr-16">
      <div className="-ml-14 mb-10">
        <Link href="/manage-user">
          <Image
            src="/icons/back-arrow.svg"
            alt="back-arrow"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div className="-mt-[78px]">
        <h1 className="text-2xl text-primary-700 font-bold">Tambah Pengguna</h1>
        <div className="w-full h-full bg-neutral-200 rounded-[20px] mt-3 p-8">
          <h1 className="text-xl font-semibold mb-4">Data Diri</h1>
          <UserData label="Ubah" data={result} />
        </div>
      </div>
    </section>
  );
};

export default UpdateUserData;
