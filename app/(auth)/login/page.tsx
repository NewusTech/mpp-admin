"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import FormSignin from "@/components/Form/Signin";
import Link from "next/link";
import { fetcher } from "@/lib/fetch";
import useSWR from "swr";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const LoginPage = () => {
  // /user/termcond/get

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/termcond/get`,
    fetcher,
  );

  const term = data?.data;

  return (
    <section className="bg-gradient-to-b from-primary-700 to-[#99B3E0] w-screen h-screen flex justify-center items-center">
      <div className="flex rounded-[20px] flex-col justify-center items-center bg-neutral-50 px-20 py-14 min-w-[600px] min-h-[480px]">
        <Image
          src="/logo.svg"
          width={133}
          height={107}
          alt="logo"
          className="mb-3"
        />
        <h3 className="font-semibold text-[16px] text-secondary-700">
          Mal Pelayanan Publik
        </h3>
        <h3 className="text-sm text-primary-700">Kabupaten Lampung Timur</h3>
        <div className="w-full space-y-2">
          <FormSignin />
        </div>
        <div className="w-full text-center text-primary-700 text-[14px] mt-4">
          Dengan mendaftar, Anda menyetujui&nbsp;
          {term && (
            <Link
              href={term?.desc}
              target="_blank"
              className="text-primary-800 font-semibold hover:underline"
            >
              Syarat & Ketentuan,
            </Link>
          )}
          <br />
          kami dan Anda telah membaca&nbsp;
          {term && (
            <Link
              href={term?.privasi}
              target="_blank"
              className="text-primary-800 font-semibold hover:underline"
            >
              Kebijakan Privasi&nbsp;
            </Link>
          )}
          kami.
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
