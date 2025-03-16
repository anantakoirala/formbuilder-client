import SideMenu from "@/components/SideMenu";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex h-[calc(100vh-65px)] w-full flex-row">
      <div className="hidden md:flex relative w-[45px]">
        <SideMenu />
      </div>
      <main className="w-full flex-1">{children}</main>
    </div>
  );
};

export default layout;
