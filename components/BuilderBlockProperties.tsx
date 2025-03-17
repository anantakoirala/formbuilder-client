import React from "react";
import { Button } from "./ui/button";
import { Eye, Save, Send } from "lucide-react";

type Props = {};

const BuilderBlockProperties = (props: Props) => {
  return (
    <div className="hidden relative w-[320px]">
      <div className="fixed right w-[320px] bg-white border-l shadow-sm h-screen pb-36 mt-0 overflow-auto">
        <div className="flex flex-col w-full items-center h-auto min-h-full">
          <div className="w-full flex flex-row items-center bg-white pb-2 pt-3  sticky border border-primary top-0 gap-2 px-2">
            <Button
              size={"sm"}
              variant={"outline"}
              className="shrink-0 text-primary bg-primary/10 border-primary"
            >
              <Eye />
              Preview
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="shrink-0 text-primary bg-primary/10 border-primary"
            >
              <Save />
              Save
            </Button>
            <Button className="text-white" size={"sm"}>
              <Send />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderBlockProperties;
