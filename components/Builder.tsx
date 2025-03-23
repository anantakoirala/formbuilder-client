import React, { Dispatch, SetStateAction, useEffect } from "react";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import BuilderSidebar from "./BuilderSidebar";
import { defaultBackgroundColor } from "@/constants";
import BuilderCanvas from "./BuilderCanvas";
import BuilderBlockProperties from "./BuilderBlockProperties";
import FloatingShareButton from "./FloatingShareButton";
import DrawerIcon from "./icons/DrawerIcon";
import { useDispatch } from "react-redux";
import { closeSheet, toggleSheet } from "@/redux/properties/PropertiesSlice";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  isSideBarOpen: boolean;
};

const Builder = ({ isSideBarOpen }: Props) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isMobile) {
      dispatch(closeSheet());
    }
  }, [isMobile, dispatch]); // Runs when `isMobile` changes
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
          {/* <SidebarTrigger className="absolute top-0 right-3 z-50" /> */}
          {isMobile && (
            <div
              className="absolute top-1 right-2 z-50 pt-0.5"
              onClick={() => dispatch(toggleSheet())}
            >
              <DrawerIcon />
            </div>
          )}
          <FloatingShareButton isSideBarOpen={isSideBarOpen} />
        </div>
      </SidebarInset>
      <div className="hidden md:block">
        <BuilderBlockProperties />
      </div>
    </>
  );
};

export default Builder;
