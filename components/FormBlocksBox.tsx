"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FormBlocks } from "@/lib/form-blocks";
import BlockBtnElements from "./BlockBtnElements";

type Props = {};

const FormBlocksBox = (props: Props) => {
  const { form } = useSelector((state: RootState) => state.form);
  const isPublished = form.published;
  const [search, setSearch] = useState<string>("");

  const filteredBlocks = Object.values(FormBlocks).filter((block) =>
    block.blockBtnElement.label?.toLowerCase().includes(search.toLowerCase())
  );

  const layoutBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Layout"
  );

  const fieldBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Field"
  );
  return (
    <div className="w-full ">
      <div className="flex gap-2 py-4 text-sm">
        <Input
          placeholder="Search Blocks"
          className="placeholder:text-primary shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-3 w-full">
        {layoutBlocks?.length > 0 && (
          <div className="mb-2">
            <h5 className="text-[13px] text-card-foreground font-medium">
              Layouts
            </h5>
            <div className="pt-1 grid grid-cols-3 gap-3">
              {layoutBlocks.map((block) => (
                <BlockBtnElements
                  key={block.blockType}
                  formBlock={block}
                  disabled={isPublished}
                />
              ))}
            </div>
          </div>
        )}
        <Separator className="bg-primary" />
        <div className="">
          <h5 className="text-[13px] text-card-foreground font-medium">
            Fields
          </h5>
          <div className="pt-1 grid grid-cols-3 gap-3">
            {fieldBlocks.map((block) => (
              <BlockBtnElements
                key={block.blockType}
                formBlock={block}
                disabled={isPublished}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBlocksBox;
