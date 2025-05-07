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
import {
  useChangeFormNameMutation,
  useUpdateFormMutation,
} from "@/redux/form/formApi";
import { handleApiError } from "@/lib/handleApiError";
import toast from "react-hot-toast";

type Props = {};

const BuilderSidebar = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { form } = useSelector((state: RootState) => state.form);
  const [formName, setFormName] = useState(form?.name || "Untitled");
  const [tabs, setTabs] = useState<"blocks" | "settings">("blocks");

  const [updateName, { isLoading }] = useChangeFormNameMutation();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  const handleBlur = async () => {
    console.log("form", form.id);
    try {
      setIsEditing(false);
      await updateName({ data: { formId: form.id, name: formName } }).unwrap();
      toast.success("Name edited successfully");
    } catch (error) {
      handleApiError(error);
    }

    // dispatch update to redux or backend here, e.g. updateFormName(form._id, formName)
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
  };
  return (
    <Sidebar className="border-r  pt-16 h-full">
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
                    {isEditing ? (
                      <input
                        className="text-sm w-[110px] truncate border-none outline-none bg-transparent"
                        value={formName}
                        autoFocus
                        onChange={handleNameChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                      />
                    ) : (
                      <h5
                        onClick={() => setIsEditing(true)}
                        className="truncate flex w-[110px] text-sm cursor-pointer hover:underline"
                        title={formName}
                      >
                        {formName}
                      </h5>
                    )}
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
            {/* <button
              className={cn(
                `p-[5px] flex-1 bg-transparent transition-colors ease-in-out rounded-full text-center font-medium text-sm text-muted-foreground`,
                { "bg-primary text-white": tabs === "settings" }
              )}
              onClick={() => setTabs("settings")}
            >
              Settings
            </button> */}
          </div>
          {/* Form blocks */}
          {tabs === "blocks" && <FormBlocksBox />}
          {/* Form Settings */}
          {/* {tabs === "settings" && <FormSettings />} */}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;
