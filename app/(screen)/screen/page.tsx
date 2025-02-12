"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";
import { jwtDecode } from "jwt-decode";
import Image from "next/legacy/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import Slider from "react-slick";
import socket from "@/lib/socket";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface JwtPayload {
  role?: string;
  instansi: string;
  instansi_id: number;
}

export default function Screen() {
  const [role, setRole] = useState<string | null>(null);
  const [instansi, setInstansi] = useState<string | null>(null);
  const [instansiid, setInstansiid] = useState<number>();
  const [tanggal, setTanggal] = useState<string>("");
  const [jam, setJam] = useState<string>("");
  const [result, setResult] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [antrianLast, setAntrianLast] = useState<any>(null);

  const { data, mutate } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/instansi/screen`,
    fetcher
  );

  useEffect(() => {
    // Periksa apakah data sudah tersedia dan set state result dan antrianLast
    if (data && data.data) {
      setCount(data?.data?.count || 0);
      setResult(data.data.antrian || []);
      setAntrianLast(data.data.antrian_last || null);
    }

    socket.on("updateAntrian", (data: any) => {
      // Memanggil ulang mutate untuk memperbarui data

      if (data == instansiid) {
        console.log("apaaa", data);
        mutate();
      }
    });

    // Membersihkan event listener saat komponen unmount
    return () => {
      socket.off("updateAntrian");
    };
  }, [data]);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);

        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role && decoded.instansi !== undefined) {
          setRole(decoded.role);
          setInstansi(decoded.instansi);
          setInstansiid(decoded.instansi_id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Ambil waktu sekarang dan perbarui setiap detik
    const updateDateTime = () => {
      const now = new Date();

      // Format hari, tanggal, bulan, tahun
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const formattedDate = now.toLocaleDateString("id-ID", options);

      // Format jam dan menit
      const formattedTime = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // Tambahkan detik untuk memperbarui setiap detik
        hour12: false,
      });

      setTanggal(formattedDate);
      setJam(formattedTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000); // Perbarui setiap detik

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: count > 4 ? 4 : count,
    slidesToScroll: 1,
    autoplay: count > 4,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false, // Hilangkan tombol navigasi kiri-kanan
    dots: false,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 1,
    //     },
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  };

  return (
    <ProtectedRoute
      roles={["Admin Instansi", "Admin Layanan", "Admin Verifikasi"]}
    >
      <div className="flex flex-col w-full px-24 gap-y-4 h-full">
        <div className="flex flex-row w-full gap-x-4 mt-3">
          <div className="flex flex-row w-1/12">
            <Image
              src="/logo-1.png"
              alt="Lampung Timur"
              className="w-full h-full object-fill"
              width={1000}
              height={1000}
            />
          </div>

          <div className="flex justify-center items-center bg-primary-700 rounded-lg w-full">
            <h3 className="capitalize text-neutral-50 text-[24px] font-semibold">
              {instansi}
            </h3>
          </div>

          <div className="grid grid-cols-2 place-items-center justify-center items-center bg-secondary-700 rounded-lg w-4/12">
            <div className="flex flex-col">
              <h3 className="text-neutral-50 text-[20px]">
                {tanggal.split(",")[0]}
              </h3>

              <p className="text-neutral-50 text-[20px]">
                {tanggal.split(",")[1]}
              </p>
            </div>

            <div className="">
              <h3 className="text-neutral-50 text-[32px] font-semibold">
                {jam}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full gap-x-4">
          <div className="flex flex-col justify-evenly items-center bg-secondary-700 rounded-lg w-5/12">
            <h4 className="text-neutral-50 font-semibold text-[30px]">
              Nomor Antrian
            </h4>
            <h2 className="text-neutral-50 font-semibold text-[50px]">
              {antrianLast?.antrian_now ?? "-"}
            </h2>
          </div>
          <div className="flex flex-col justify-evenly bg-primary-700 text-center py-10 min-h-[300px] w-full rounded-lg h-full space-y-5">
            <h5 className="text-neutral-50 font-bold text-4xl">Loket</h5>
            <h5 className="text-neutral-50 font-bold text-4xl">
              {antrianLast?.code ?? "-"}
            </h5>
          </div>
        </div>

        <div className="space-y-6">
          <div className="w-full">
            <p className="capitalize text-slate-800 text-[24px] font-semibold">
              Antrean Saat Ini
            </p>

            <div className="slider-container mt-2">
              <Slider {...settings} className="gap-x-4">
                {result?.map((item: any, index: any) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-8 mr-4 ${
                      index % 4 === 0
                        ? "bg-[#3597FC]"
                        : index % 4 === 1
                          ? "bg-[#00CC83]"
                          : index % 4 === 2
                            ? "bg-[#ED4B54]"
                            : "bg-[#A636FF]"
                    }`}
                  >
                    <h4 className="text-neutral-50 font-semibold text-[46px]">
                      {item.antrian_now}
                    </h4>

                    <h5 className="text-neutral-50 font-normal text-[26px]">
                      {`Loket ${item.code}`}
                    </h5>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="w-full">
            <p className="capitalize text-slate-800 text-[24px] font-semibold">
              Antrean Selanjutnya
            </p>

            <div className="slider-container mt-2">
              <Slider {...settings}>
                {result?.map((item: any, index: any) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-8 ${
                      index % 4 === 0
                        ? "bg-[#c815ff]"
                        : index % 4 === 1
                          ? "bg-[#ff7417]"
                          : index % 4 === 2
                            ? "bg-[#55090d]"
                            : "bg-[#16d0ff]"
                    }`}
                  >
                    <h4 className="text-neutral-50 font-semibold text-[46px]">
                      {item.antrian_next}
                    </h4>

                    <h5 className="text-neutral-50 font-normal text-[26px]">
                      {`Loket ${item.code}`}
                    </h5>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
