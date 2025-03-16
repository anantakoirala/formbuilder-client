"use client";
import React, { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import { FileTextIcon, Home } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { cn } from "@/lib/utils";
import FormBlocksBox from "./FormBlocksBox";
import FormSettings from "./FormSettings";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Props = {};

const BuilderSidebar = (props: Props) => {
  const { form } = useSelector((state: RootState) => state.form);
  const [tabs, setTabs] = useState<"blocks" | "settings">("blocks");
  return (
    <Sidebar className="border-r left-12 pt-16 h-full">
      <SidebarHeader className="px-0 bg-background">
        <header className="border-b border-primary w-full pt-1 pb-2 flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <Home className="-ml-1 w-4 h-4" />
            <Separator orientation="vertical" className="mr-2 h-4 " />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashbaord">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1">
                    <FileTextIcon className="w-4 h-4 mb-[3px]" />
                    <h5 className="truncate flex w-[110px] text-sm">
                      {form?.name || "Untitled"}
                    </h5>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarHeader>
      <SidebarContent className="pt-2 px-5 bg-background">
        <div className="w-full">
          <div className="w-full flex flex-row gap-1 h-[39px] rounded-full bg-muted p-1">
            <button
              className={cn(
                `p-[5px] flex-1 bg-transparent transition-colors ease-in-out rounded-full text-center font-medium text-sm text-muted-foreground`,
                { "bg-primary text-white": tabs === "blocks" }
              )}
              onClick={() => setTabs("blocks")}
            >
              Blocks
            </button>
            <button
              className={cn(
                `p-[5px] flex-1 bg-transparent transition-colors ease-in-out rounded-full text-center font-medium text-sm text-muted-foreground`,
                { "bg-primary text-white": tabs === "settings" }
              )}
              onClick={() => setTabs("settings")}
            >
              Settings
            </button>
          </div>
          {/* Form blocks */}
          {tabs === "blocks" && <FormBlocksBox />}
          {/* Form Settings */}
          {tabs === "settings" && <FormSettings />}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;
