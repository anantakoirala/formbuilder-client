"use client";
import React from "react";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { defaultBackgroundColor } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FormBlocks } from "@/lib/form-blocks";

type Props = {};

const PreviewDialog = (props: Props) => {
  const { blockLayouts } = useSelector((state: RootState) => state.form);
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button
            size={"sm"}
            variant={"outline"}
            className="shrink-0 text-primary bg-primary/10 border-primary"
          >
            <Eye />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col flex-grow max-h-svh h-full gap-0 w-screen max-w-full">
          <DialogHeader className="pt-4 px-4 pb-4 shadow-sm bg-white">
            <DialogTitle>Preview Mode</DialogTitle>
          </DialogHeader>
          <div
            className="w-full h-full overflow-y-auto transition-all duration-300"
            style={{
              backgroundColor: defaultBackgroundColor,
            }}
          >
            <div className="w-full h-full max-w-[650px] mx-auto">
              <div className="w-full relative bg-transparent px-2 flex flex-col items-center justify-start pt-1 pb-14">
                <div className="w-full mb-3 bg-white bg-[url(/form-bg.jpg)] bg-center bg-cover bg-no-repeat border shadow-sm h-[135px] max-w-[768px] rounded-md px-1"></div>
                {blockLayouts.length > 0 && (
                  <div className="flex flex-col w-full gap-4 ">
                    {blockLayouts.map((block) => {
                      const FormBlockComponents =
                        FormBlocks[block.blockType].formComponent;
                      return (
                        <>
                          <FormBlockComponents
                            blockInstance={block}
                            key={block.id}
                          />
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewDialog;
