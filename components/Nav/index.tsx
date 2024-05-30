"use client";

import Image from "next/image";
import { NavProps } from "@/type/type";
import Link from "next/link";
import { useState } from "react";

const Nav = ({ icons, title, type, route }: NavProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleDropdownOpen = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (type === "dropdown")
    return (
      <>
        <div
          className="p-3 rounded-lg flex justify-between items-center"
          onClick={handleDropdownOpen}
        >
          <div className="flex items-center space-x-4">
            <Image src={icons} alt={title} width={20} height={20} />
            <p>{title}</p>
          </div>
          <Image
            src="/icons/u_angle-down.svg"
            alt="arrow-down"
            width={20}
            height={20}
          />
        </div>
        {isDropdownOpen && <div className="p-3">Hello</div>}
      </>
    );

  return (
    <Link href={route} className="flex items-center space-x-4 p-3 rounded-lg">
      <Image src={icons} alt={title} width={20} height={20} />
      <p>{title}</p>
    </Link>
  );
};

export default Nav;
