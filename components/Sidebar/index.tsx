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
import Swal from "sweetalert2";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "700"],
  variable: "--font-inter",
});

interface JwtPayload {
  role?: string;
  instansi_id: number;
  instansi: string;
  layanan_id: number;
  layanan: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [instansiId, setInstansiId] = useState<number | null>(null);
  const [layananId, setLayananId] = useState<number | null>(null);
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [layanan, setLayanan] = useState<string | null>(null);
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
          setLayananId(decoded.layanan_id);
          setLayanan(decoded.layanan);
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
    } else if (pathname.startsWith("/manage-user")) {
      setIsDropdownOpen("/manage-user");
    } else if (pathname.startsWith("/report")) {
      setIsDropdownOpen("/report");
    } else {
      setIsDropdownOpen(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    Swal.fire({
      icon: "success",
      title: "Berhasil Logout",
      timer: 2000,
      showConfirmButton: false,
      position: "center",
    });
    router.push("/login");
  };

  return (
    <aside className="bg-neutral-200 fixed w-[291px] h-full overflow-scroll custom-scrollbar">
      <div className="px-8 py-[54px]">
        <h1 className="text-xl font-semibold">
          {role === "Admin Instansi" ? "Kepala Dinas" : role}
        </h1>
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
                  <li
                    className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/request/revision") || pathname.startsWith("/request/revision") ? "text-primary-700" : ""}`}
                  >
                    <Link href="/request/revision">Revisi</Link>
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
            route="#"
            path="/report"
            icons="/icons/Report.svg"
            iconsActive="/icons/Report-active.svg"
            title="Laporan"
            type="dropdown"
            content={
              <ul className="space-y-4">
                <li
                  className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/report/request") || pathname.startsWith("/report/request") ? "text-primary-700" : ""}`}
                >
                  <Link
                    href={
                      role === "Admin Layanan"
                        ? `/report/request/${layananId}`
                        : "/report/request"
                    }
                  >
                    Permohonan
                  </Link>
                </li>
                <li
                  className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/report/performance") || pathname.startsWith("/report/performance") ? "text-primary-700" : ""}`}
                >
                  <Link href="/report/performance">Kinerja</Link>
                </li>
                <li
                  className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/report/document") || pathname.startsWith("/report/document") ? "text-primary-700" : ""}`}
                >
                  <Link href="/report/document">Dokumen Terbit</Link>
                </li>
                <li
                  className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/report/problems") || pathname.startsWith("/report/problems") ? "text-primary-700" : ""}`}
                >
                  <Link href="/report/problems">Permasalahan</Link>
                </li>
                <li
                  className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/report/geo") || pathname.startsWith("/report/geo") ? "text-primary-700" : ""}`}
                >
                  <Link href="/report/geo">Geo Layanan</Link>
                </li>
              </ul>
            }
            isDropdownOpen={isDropdownOpen === "/report"}
            handleDropdownOpen={() => handleDropdownOpen("/report")}
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
                  {role !== "Admin Layanan" && role !== "Admin Verifikasi" && (
                    <li
                      className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/survey/question") || pathname.startsWith("/survey/question") ? "text-primary-700" : ""}`}
                    >
                      <Link href="/survey/question">Pertanyaan</Link>
                    </li>
                  )}
                  <li
                    className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/survey/result") || pathname.startsWith("/survey/result") ? "text-primary-700" : ""}`}
                  >
                    <Link
                      href={
                        role !== "Admin Layanan"
                          ? "/survey/result"
                          : `/survey/result/${layananId}`
                      }
                    >
                      Hasil
                    </Link>
                  </li>
                </ul>
              </>
            }
            isDropdownOpen={isDropdownOpen === "/survey"}
            handleDropdownOpen={() => handleDropdownOpen("/survey")}
          />
          {role !== "Admin Layanan" && role !== "Admin Verifikasi" && (
            <Nav
              route="/articles"
              path="/articles"
              icons="/icons/newspaper.svg"
              iconsActive="/icons/newspaper-active.svg"
              title="Berita"
            />
          )}
          <Nav
            route="/manual-book"
            path="/manual-book"
            icons="/icons/pdf.svg"
            iconsActive="/icons/pdf-active.svg"
            title="Manual Book"
          />
          <Nav
            route="/complaint"
            path="/complaint"
            icons="/icons/send.svg"
            iconsActive="/icons/send-active.svg"
            title="Pengaduan"
          />
          <Nav
            route="/guest-book"
            path="/guest-book"
            icons="/icons/book-open.svg"
            iconsActive="/icons/book-open-active.svg"
            title="Buku Tamu"
          />
          {role !== "Admin Layanan" && role !== "Admin Verifikasi" && (
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
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/announcement") || pathname.startsWith("/master/announcement") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/announcement">Pengumuman</Link>
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
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/manual-book") || pathname.startsWith("/master/manual-book") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/manual-book">Manual Book</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/flow-booking") || pathname.startsWith("/master/flow-booking") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/flow-booking">Alur Booking</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/sop-mpp") || pathname.startsWith("/master/sop-mpp") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/sop-mpp">SOP MPP</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/sop-instance") || pathname.startsWith("/master/sop-instance") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/sop-instance">SOP Instance</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/maklumat") || pathname.startsWith("/master/maklumat") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/maklumat">Maklumat</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/logo") || pathname.startsWith("/master/logo") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/logo">Logo</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/carousel") || pathname.startsWith("/master/carousel") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/carousel">Slider</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-apps") || pathname.startsWith("/master/master-apps") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/master-apps">
                            Aplikasi Pendukung
                          </Link>
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
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/sop-instance") || pathname.startsWith("/master/sop-instance") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/sop-instance">SOP Instansi</Link>
                        </li>
                        <li
                          className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/master/master-apps-instance") || pathname.startsWith("/master/master-apps-instance") ? "text-primary-700" : ""}`}
                        >
                          <Link href="/master/master-apps-instance">
                            Aplikasi Instansi
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </>
              }
              isDropdownOpen={isDropdownOpen === "/master"}
              handleDropdownOpen={() => handleDropdownOpen("/master")}
            />
          )}
          <Nav
            route="#"
            path="/manage-user"
            icons="/icons/user-round.svg"
            iconsActive="/icons/user-round-active.svg"
            title="Kelola Akun"
            type="dropdown"
            content={
              <>
                <ul className="space-y-4">
                  {role !== "Admin Instansi" && role !== "Admin Layanan" && (
                    <li
                      className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/manage-user/society") || pathname.startsWith("/manage-user/society") ? "text-primary-700" : ""}`}
                    >
                      <Link href="/manage-user/society">Masyarakat</Link>
                    </li>
                  )}
                  {role !== "Admin Layanan" && role !== "Admin Verifikasi" && (
                    <>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/manage-user/admin") || pathname.startsWith("/manage-user/admin") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/manage-user/admin">Admin</Link>
                      </li>
                      <li
                        className={`hover:translate-x-2 hover:text-primary-700 transition-color duration-200 ${isActive("/manage-user/permission") || pathname.startsWith("/manage-user/permission") ? "text-primary-700" : ""}`}
                      >
                        <Link href="/manage-user/permission">Hak Akses</Link>
                      </li>
                    </>
                  )}
                </ul>
              </>
            }
            isDropdownOpen={isDropdownOpen === "/manage-user"}
            handleDropdownOpen={() => handleDropdownOpen("/manage-user")}
          />
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
            {role === "Admin Layanan" ? (
              <p className="text-[#71839B]">{layanan}</p>
            ) : (
              <p className="text-[#71839B]">{instanceName}</p>
            )}
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
