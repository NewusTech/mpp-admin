import Image from "next/image";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import DashboardIcon from "@/assets/icons/dashboard-icons";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const Sidebar = () => {
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
              stroke="#3A6C38"
            />
            <p>Dashboard</p>
          </Link>
          <Nav
            route="/manage-requirement"
            icons="/icons/book-text.svg"
            title="Kelola Persyaratan"
          />
          <Nav
            route="/"
            icons="/icons/data-permohonan.svg"
            title="Permohonan"
            type="dropdown"
          />
          <Nav route="/" icons="/icons/stamp.svg" title="Kelola Persetujuan" />
          <Nav
            route="/"
            icons="/icons/square-library.svg"
            title="Riwayat Permohonan"
          />
          <Nav route="/" icons="/icons/Report.svg" title="Laporan" />
          <Nav route="/" icons="/icons/clipboard-list.svg" title="SKM" />
          <Nav route="/articles" icons="/icons/newspaper.svg" title="Berita" />
          <Nav
            route="/"
            icons="/icons/Master.svg"
            title="Data Master"
            type="dropdown"
          />
          <Nav route="/" icons="/icons/user-round.svg" title="Kelola User" />
          <Nav route="/" icons="/icons/settings.svg" title="Pengaturan" />
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
