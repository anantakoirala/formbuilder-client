"use client";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  isSideBarOpen: boolean;
};

const FloatingShareButton = ({ isSideBarOpen }: Props) => {
  const { form } = useSelector((state: RootState) => state.form);

  if (!form.published) return null;

  const copyLinkToClipboard = () => {
    const shareableLink = `${process.env.NEXT_PUBLIC_BASE_URL}/public/submit-form/${form?.id}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast.success("The shareable link has been copied to your clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy the link. Please try again.");
      });
  };
  return (
    <div
      className="fixed bottom-5 z-50 transition-transform  duration-500 ease-in-out"
      style={{
        left: isSideBarOpen ? "calc(41% + 150px)" : "41%",
        transform: "translateX(-50%)",
      }}
    >
      <Button
        onClick={copyLinkToClipboard}
        className="rounded-full bg-primary text-white p-4 shadow-xl transition-all duration-300 hover:scale-105"
        variant={"outline"}
        size={"lg"}
        aria-label="Copy shareable link"
      >
        <Copy className="w-5 h-5" />
        Share Link
      </Button>
    </div>
  );
};

export default FloatingShareButton;
