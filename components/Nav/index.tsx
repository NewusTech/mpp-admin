"use client";

import Image from "next/image";
import { NavProps } from "@/types/interface";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = ({
  icons,
  title,
  type,
  route,
  content,
  iconsActive,
  isDropdownOpen,
  handleDropdownOpen,
  path,
}: NavProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  if (type === "dropdown")
    return (
      <>
        <div
          className={`p-3 cursor-pointer hover:translate-x-2 duration-300 transition rounded-lg flex justify-between items-center ${isActive(path) || isDropdownOpen ? "bg-primary-300 text-primary-800" : ""}`}
          onClick={handleDropdownOpen}
        >
          <div className="flex items-center space-x-4">
            {isActive(path) || isDropdownOpen ? (
              <Image src={iconsActive} alt={title} width={20} height={20} />
            ) : (
              <Image src={icons} alt={title} width={20} height={20} />
            )}
            <p>{title}</p>
          </div>
          <Image
            src="/icons/u_angle-down.svg"
            alt="arrow-down"
            width={20}
            height={20}
            className={`
              ${isDropdownOpen ? "rotate-180" : "rotate-0"} transition duration-300
            `}
          />
        </div>
        {isDropdownOpen && (
          <div className="py-4 px-12 bg-neutral-300 rounded-lg">{content}</div>
        )}
      </>
    );

  return (
    <Link
      href={route}
      className={`flex items-center hover:translate-x-2 duration-300 transition space-x-4 p-3 rounded-lg ${isActive(path) ? "bg-primary-300 text-primary-800" : ""}`}
    >
      {isActive(path) ? (
        <Image src={iconsActive} alt={title} width={20} height={20} />
      ) : (
        <Image src={icons} alt={title} width={20} height={20} />
      )}
      <p>{title}</p>
    </Link>
  );
};

export default Nav;
