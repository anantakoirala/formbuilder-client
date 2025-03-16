import React from "react";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import BuilderSidebar from "./BuilderSidebar";
import { defaultBackgroundColor } from "@/constants";
import BuilderCanvas from "./BuilderCanvas";
import BuilderBlockProperties from "./BuilderBlockProperties";

type Props = {
  isSideBarOpen: boolean;
};

const Builder = ({ isSideBarOpen }: Props) => {
  return (
    <>
      <BuilderSidebar />
      <SidebarInset className="p-0 flex-1 h-full">
        <div
          className="w-full h-full"
          style={{ backgroundColor: defaultBackgroundColor }}
        >
          <SidebarTrigger className="absolute top-0 z-50" />
          {/* BuilderCanvas */}
          <BuilderCanvas />
        </div>
      </SidebarInset>
      <BuilderBlockProperties />
    </>
  );
};

export default Builder;
