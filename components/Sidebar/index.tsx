import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "@/lib/store/useAuthStore";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "700"],
  variable: "--font-inter",
});

interface JwtPayload {
  role?: string;
  instansi_id: number;
  instansi: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path: string) => pathname === path;

  const handleDropdownOpen = (route: string) => {
    setIsDropdownOpen(isDropdownOpen === route ? null : route);
  };

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
          setInstanceName(decoded.instansi);
        } else if (decoded && decoded.role) {
          setRole(decoded.role);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Set isDropdownOpen to true if current path matches "/request" or its subpaths
    if (pathname.startsWith("/request")) {
      setIsDropdownOpen("/request");
    } else if (pathname.startsWith("/survey")) {
      setIsDropdownOpen("/survey");
    } else if (pathname.startsWith("/master")) {
      setIsDropdownOpen("/master");
    } else {
      setIsDropdownOpen(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast("Berhasil logout");
    router.push("/login");
  };

  return (
    <aside className="bg-neutral-200 fixed w-[291px] h-full overflow-scroll custom-scrollbar">
      <div className="px-8 py-[54px]">
        <h1 className="text-[32px] font-semibold">Admin</h1>
        <div className={`${inter.className} space-y-2 text-neutral-900 mt-8`}>
          <Nav
            route="/"
            path="/"
            icons="/icons/dashboard.svg"
            iconsActive="/icons/dashboard-active.svg"
            title="Dashboard"
          />
          <Nav
            route="/manage-requirement"
            path="/manage-requirement"
            icons="/icons/book-text.svg"
            iconsActive="/icons/book-text-active.svg"
            title="Kelola Persyaratan"
          />
          <Nav
            route="#"
            path="/request"
            icons="/icons/data-permohonan.svg"
            iconsActive="/icons/data-permohonan-active.svg"
            title="Permohonan"
            type="dropdown"
            content={
              <>
                <ul className="space-y-4">
                  <li
                    className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/request/online") || pathname.startsWith("/request/online") ? "text-primary-700" : ""}`}
                  >
                    <Link href="/request/online">Online</Link>
                  </li>
                  <li
                    className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/request/offline") || pathname.startsWith("/request/offline") ? "text-primary-700" : ""}`}
                  >
                    <Link href="/request/offline">Offline</Link>
                  </li>
                </ul>
              </>
            }
            isDropdownOpen={isDropdownOpen === "/request"}
            handleDropdownOpen={() => handleDropdownOpen("/request")}
          />
          <Nav
            route="/manage-approvals"
            path="/manage-approvals"
            icons="/icons/stamp.svg"
            iconsActive="/icons/stamp-active.svg"
            title="Kelola Persetujuan"
          />
          <Nav
            route="/history-approvals"
            path="/history-approvals"
            icons="/icons/square-library.svg"
            iconsActive="/icons/square-library-active.svg"
            title="Riwayat Permohonan"
          />
          <Nav
            route="/report"
            path="/report"
            icons="/icons/Report.svg"
            iconsActive="/icons/Report-active.svg"
            title="Laporan"
          />
          <Nav
            route="#"
            path="/survey"
            icons="/icons/clipboard-list.svg"
            iconsActive="/icons/clipboard-list-active.svg"
            title="SKM"
            type="dropdown"
            content={
              <>
                <ul className="space-y-4">
                  <li
                    className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/survey/question") || pathname.startsWith("/survey/question") ? "text-primary-700" : ""}`}
                  >
                    <Link href="/survey/question">Pertanyaan</Link>
                  </li>
                  <li
                    className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/survey/result") || pathname.startsWith("/survey/result") ? "text-primary-700" : ""}`}
                  >
                    <Link href="/survey/result">Hasil</Link>
                  </li>
                </ul>
              </>
            }
            isDropdownOpen={isDropdownOpen === "/survey"}
            handleDropdownOpen={() => handleDropdownOpen("/survey")}
          />
          <Nav
            route="/articles"
            path="/articles"
            icons="/icons/newspaper.svg"
            iconsActive="/icons/newspaper-active.svg"
            title="Berita"
          />
          {role === "Admin Instansi" && (
            <Nav
              route="/complaint"
              path="/complaint"
              icons="/icons/send.svg"
              iconsActive="/icons/send-active.svg"
              title="Pengaduan"
            />
          )}
          <Nav
            route="#"
            path="/master"
            icons="/icons/Master.svg"
            iconsActive="/icons/Master-active.svg"
            title="Data Master"
            type="dropdown"
            content={
              <>
                <ul className="space-y-4">
                  {role !== "Admin Instansi" ? (
                    <>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-instance") || pathname.startsWith("/master/master-instance") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/master-instance">Instansi</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-service") || pathname.startsWith("/master/master-service") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/master-service">Layanan</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-facility") || pathname.startsWith("/master/master-facility") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/master-facility">Fasilitas</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-faq") || pathname.startsWith("/master/master-faq") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/master-faq">FAQ</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/vision-mission") || pathname.startsWith("/master/vision-mission") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/vision-mission">Visi Misi</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/video") || pathname.startsWith("/master/video") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/video">Video</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/flow-mpp") || pathname.startsWith("/master/flow-mpp") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/flow-mpp">Alur MPP</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/flow-request") || pathname.startsWith("/master/flow-request") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/flow-request">Alur Permohonan</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/flow-booking") || pathname.startsWith("/master/flow-booking") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/flow-booking">Alur Booking</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/carousel") || pathname.startsWith("/master/carousel") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/carousel">Slider</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-apps") || pathname.startsWith("/master/master-apps") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/master-apps">Aplikasi Dinas</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/contact") || pathname.startsWith("/master/contact") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/contact">Kontak</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/term-and-condition") || pathname.startsWith("/master/term-and-condition") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/term-and-condition">
                          Syarat & Ketentuan
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-service") || pathname.startsWith("/master/master-service") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/master/master-service">Layanan</Link>
                      </li>
                    </>
                  )}
                </ul>
              </>
            }
            isDropdownOpen={isDropdownOpen === "/master"}
            handleDropdownOpen={() => handleDropdownOpen("/master")}
          />
          {role === "Admin Instansi" ? (
            ""
          ) : (
            <Nav
              route="/manage-user"
              path="/manage-user"
              icons="/icons/user-round.svg"
              iconsActive="/icons/user-round-active.svg"
              title="Kelola User"
            />
          )}
          <Nav
            route="/setting"
            path="/setting"
            icons="/icons/settings.svg"
            iconsActive="/icons/settings-active.svg"
            title="Pengaturan"
          />
        </div>
        <div
          className="flex gap-2 items-center mt-11 cursor-pointer"
          onClick={() => handleDropdownOpen("/logout")}
        >
          <div className="h-10 w-10 rounded-full bg-white">
            <img
              src={`https://ui-avatars.com/api/?name=${role}&background=random`}
              alt="image"
              className="rounded-full w-full h-full"
            />
          </div>
          <div className="flex flex-col text-xs">
            <p className="text-[#324054]">{role}</p>
            <p className="text-[#71839B]">{instanceName}</p>
          </div>
        </div>
        {isDropdownOpen === "/logout" && (
          <div className="py-4 px-12 bg-neutral-300 rounded-lg mt-3">
            <div
              className="hover:translate-x-2 text-neutral-900 flex items-center gap-x-2 hover:text-primary-700 transition-color duration-200 text-sm cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <p>Logout</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
