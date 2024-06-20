import Image from "next/image";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import DashboardIcon from "@/assets/icons/dashboard-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

interface JwtPayload {
  role?: string;
  instansi_id: number;
}

const Sidebar = () => {
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("token");

    // Periksa apakah token ada dan decode token jika ada
    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode<JwtPayload>(token);

        // Pastikan token terdecode dan mengandung informasi role dan instansi_id
        if (decoded && decoded.role && decoded.instansi_id !== undefined) {
          setRole(decoded.role);
          setInstansiId(decoded.instansi_id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <aside className="bg-neutral-200 fixed w-[291px] h-full overflow-scroll custom-scrollbar">
      <div className="px-8 py-[54px]">
        <h1 className="text-[32px] font-semibold">Admin</h1>
        <div className={`${inter.className} space-y-2 text-neutral-900 mt-8`}>
          <Link
            href="/"
            className="flex items-center space-x-4 p-3 text-primary-800 font-medium bg-primary-300 rounded-lg"
          >
            <DashboardIcon
              color="fill-current text-primary-800"
              stroke="#1D3A6C"
            />
            <p>Dashboard</p>
          </Link>
          <Nav
            route="/manage-requirement"
            icons="/icons/book-text.svg"
            title="Kelola Persyaratan"
          />
          <Nav
            route="#"
            icons="/icons/data-permohonan.svg"
            title="Permohonan"
            type="dropdown"
            content={
              <>
                <ul className="space-y-4">
                  <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                    <Link href="/request/online">Online</Link>
                  </li>
                  <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                    <Link href="/request/offline">Offline</Link>
                  </li>
                </ul>
              </>
            }
          />
          <Nav
            route="/manage-approvals"
            icons="/icons/stamp.svg"
            title="Kelola Persetujuan"
          />
          <Nav
            route="/history-approvals"
            icons="/icons/square-library.svg"
            title="Riwayat Permohonan"
          />
          <Nav route="/report" icons="/icons/Report.svg" title="Laporan" />
          <Nav
            route="/"
            icons="/icons/clipboard-list.svg"
            title="SKM"
            type="dropdown"
            content={
              <>
                <ul className="space-y-4">
                  <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                    <Link href="/survey/question">Pertanyaan</Link>
                  </li>
                  <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                    <Link href="/survey/result">Hasil</Link>
                  </li>
                </ul>
              </>
            }
          />
          <Nav route="/articles" icons="/icons/newspaper.svg" title="Berita" />
          {role !== "Admin Instansi" && (
            <>
              <Nav
                route="#"
                icons="/icons/Master.svg"
                title="Data Master"
                type="dropdown"
                content={
                  <>
                    <ul className="space-y-4">
                      <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                        <Link href="/master/master-instance">Instansi</Link>
                      </li>
                      <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                        <Link href="/master/master-service">Layanan</Link>
                      </li>
                      <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                        <Link href="/master/master-facility">Fasilitas</Link>
                      </li>
                      <li className="hover:translate-x-2 hover:text-primary-700 transition-color duration-200">
                        <Link href="/master/master-faq">FAQ</Link>
                      </li>
                    </ul>
                  </>
                }
              />
              <Nav
                route="/manage-user"
                icons="/icons/user-round.svg"
                title="Kelola User"
              />
            </>
          )}
          <Nav
            route="/setting"
            icons="/icons/settings.svg"
            title="Pengaturan"
          />
        </div>
        <div className="flex gap-2 items-center mt-11">
          <div className="h-10 w-10 rounded-full bg-white"></div>
          <div className="flex flex-col text-xs">
            <p className="text-[#324054]">Dila</p>
            <p className="text-[#71839B]">dila@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
