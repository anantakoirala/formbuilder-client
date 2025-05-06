"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthContext } from "@/contextProviders/AuthProvider";
import { restApi } from "@/api";

type Props = {};

const Header = (props: Props) => {
  let authContext = useContext(AuthContext);
  if (!authContext) {
    console.warn("AuthContext is not available.");
    return null; // or render a fallback UI
  }

  const { name, email } = authContext;

  const pathName = usePathname();
  const { formId } = useParams();
  const router = useRouter();

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
    // {
    //   name: "Settings",
    //   pathname: "/settings",
    // },
  ];

  const isMobile = useIsMobile();

  const filteredMenus =
    pathName === "/dashboard"
      ? menus.filter((menu) => menu.pathname === "/dashboard")
      : menus;

  const logOut = async () => {
    try {
      const response = await restApi.get("/api/auth/logout");
      router.push("/login");
    } catch (error) {}
  };
  return (
    <header className="sticky top-0 z-50 h-16 items-center gap-4 bg-primary px-4 md:px-6">
      <nav className="gap-1 md:gap-6 w-full h-full text-sm md:text-lg font-medium flex justify-between md:flex md:flex-row">
        <div className="flex items-center mr-1 md:mr-5 pr-1 md:pr-8">
          <Image
            alt="logo"
            width={isMobile ? 30 : 50}
            height={isMobile ? 30 : 50}
            src={"/logo.svg"}
          />
          <span className="sr-only">Formify</span>
        </div>
        <ul className="flex flex-row">
          {filteredMenus.map((menu, index) => {
            return (
              <li className="relative h-full" key={index}>
                <Link
                  href={menu.pathname}
                  className="text-primary-foreground text-[10px] md:text-[15.5px] font-bold z-[999] flex items-center px-1 md:px-3 justify-center h-full transition-colors hover:text-opacity-90"
                >
                  {menu.name}
                </Link>
                {pathName === menu.pathname && (
                  <div className="absolute top-0 left-0 right-0 h-[52px] bg-secondary transition-colors ease-in-out rounded-b-xl -z-[1]" />
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex item-center gap-1 justify-end w-12 md:w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div role="button" className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-gray-200 shrink-0 rounded-full">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-0.5 md:gap-2">
                  <ChevronDown className="ml-auto size-4 text-primary-foreground" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 md:mr-6">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="truncate font-semibold text-black text-[15px] md:text-sm">
                    {name}
                  </span>
                  <span className="truncate block w-full max-w-[100px] md:max-w-[150px] text-[10px] md:text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logOut()}>
                LogOut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
