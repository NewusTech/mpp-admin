import Image from "next/image";
import { Inter } from "next/font/google";
import InputComponent from "@/components/InputComponent";
import { Button } from "@/components/ui/button";
import FormSignin from "@/components/Form/Signin";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const LoginPage = () => {
  return (
    <section className="grid grid-cols-2">
      <div className="relative">
        <div className="w-full h-full">
          <Image
            src="/images/elephant.jpg"
            alt="gajah"
            width={4395}
            height={2930}
            className="w-full h-screen object-cover blur-[3px]"
          />
        </div>
        <div className="absolute z-20 inset-0 bg-black opacity-50"></div>
        <div className="absolute z-30 inset-0 flex flex-col items-center justify-center gap-6">
          <Image src="/images/logo.png" alt="logo" width={150} height={150} />
          <p
            className={`${inter.className} text-neutral-50 text-2xl font-bold`}
          >
            Mal Pelayanan Publik Lampung Timur
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10 gap-5">
        <h3 className="font-medium text-xl text-neutral-900">Login</h3>
        <div className="w-1/2 space-y-3">
          <FormSignin />
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
