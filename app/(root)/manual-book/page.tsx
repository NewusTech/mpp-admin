"use client";

import { fetcher } from "@/lib/fetch";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
}

const ManualBookPage = () => {
  const [role, setRole] = useState<string>("");
  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);
        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role) {
          setRole(decoded.role);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/manualbook/get?search=${role}`,
    fetcher,
  );

  const book = data?.data;

  return (
    <section className="mr-16">
      <div className="flex justify-center">
        <div className="flex flex-col w-full h-[550px] bg-neutral-50 shadow-md rounded-xl">
          {book &&
            book?.map((item: any, i: number) => {
              return (
                <iframe
                  key={i}
                  allowFullScreen
                  src={item.dokumen}
                  title="Manual Book"
                  className="rounded-xl w-full h-full"
                >
                  {item.id}
                </iframe>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ManualBookPage;
