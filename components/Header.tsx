"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronDown } from "lucide-react";

type Props = {};

const Header = (props: Props) => {
  const pathName = usePathname();
  const { formId } = useParams();

  const menus = [
    {
      name: "Dashbaord",
      pathname: "/dashboard",
    },
    {
      name: "Builder",
      pathname: `/dashboard/form/builder/${formId}`,
    },
    {
      name: "Responds",
      pathname: `/dashboard/form/responds/${formId}`,
    },
    {
      name: "Settings",
      pathname: "/settings",
    },
  ];
  return (
    <header className="sticky top-0 z-50 h-16 items-center gap-4 bg-primary px-4 md:px-6">
      <nav className="gap-6 w-full h-full text-lg font-medium flex justify-between md:flex md:flex-row">
        <div className="flex items-center mr-5 pr-8">
          <Image alt="logo" width={50} height={50} src={"/logo.svg"} />
          <span className="sr-only">Formify</span>
        </div>
        <ul className="hidden md:flex flex-row">
          {menus.map((menu, index) => (
            <li className="relative h-full" key={index}>
              <Link
                href={menu.pathname}
                className="text-primary-foreground text-[15.5px] font-bold z-[999] flex items-center px-3 justify-center h-full transition-colors hover:text-opacity-90"
              >
                {menu.name}
              </Link>
              {pathName === menu.pathname && (
                <div className="absolute top-0 left-0 right-0 h-[52px] bg-secondary transition-colors ease-in-out rounded-b-xl -z-[1]" />
              )}
            </li>
          ))}
        </ul>
        <div className="flex item-center gap-1 justify-end w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div role="button" className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-gray-200 shrink-0 rounded-full">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-primary-foreground">
                      Ananta koirala
                    </span>
                    <p className="truncate block w-full max-w-[150px] text-xs text-primary-foreground">
                      ananta@gmail.com
                    </p>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-primary-foreground" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
