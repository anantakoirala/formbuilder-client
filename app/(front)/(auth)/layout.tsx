"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const pathName = usePathname();

  return (
    <div className="h-screen w-full flex justify-between overflow-y-hidden">
      <div className="lg:pt-7 pt-3 lg:px-12 px-6 lg:w-2/3 w-full lg:min-w-[800px]">
        <Link href={"/"} className="inline-block">
          <Image alt="logo" width={50} height={50} src={"/logo.svg"} />
        </Link>
        <main className="w-full">
          <div className="w-full md:max-w-[550px] max-w-[360px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      <div className="lg:block hidden w-1/3 pointer-events-none">
        {pathName === "/login" ? (
          <>
            <img
              src={"/banner.jpg"}
              alt=""
              className="object-cover w-full  select-none"
            />
          </>
        ) : (
          <>
            <img
              src={"/banner.jpg"}
              alt=""
              className="object-cover w-full  select-none"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Layout;
