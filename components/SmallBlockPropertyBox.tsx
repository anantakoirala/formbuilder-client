"use client";
import React from "react";
import PreviewDialog from "./PreviewDialog";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MousePointerClickIcon } from "lucide-react";
import { FormBlocks } from "@/lib/form-blocks";

type Props = {};

const SmallBlockPropertyBox = (props: Props) => {
  const { selectedBlockLayoutId, blockLayouts } = useSelector(
    (state: RootState) => state.form
  );
  const foundSelectedBlock = blockLayouts.find(
    (block) => block.id === selectedBlockLayoutId
  );

  const LayoutPropertyBlock =
    foundSelectedBlock &&
    FormBlocks[foundSelectedBlock.blockType]?.propertiesComponent;
  return (
    <div className="relative w-full mt-1">
      <div className="w-full h-screen pb-14 overflow-auto bg-white">
        <div className="flex flex-col w-full items-center h-auto min-h-full">
          <div className="w-full flex flex-row items-center justify-center bg-white pb-2 pt-3  sticky border border-primary top-0 gap-2 px-2 z-[100]">
            <PreviewDialog />
            <SaveFormBtn />
            <PublishFormBtn />
          </div>
          {/* Layout Properties */}
          {!selectedBlockLayoutId ? (
            <div className="text-gray-400 gap-1 text-center text-[15px] w-full  flex flex-col items-center justify-center flex-1 h-auto ">
              <MousePointerClickIcon />
              <p>Click the layout to modify block</p>
            </div>
          ) : (
            <div className="w-full pt-1">
              <div className="px-2 pt-3 pb-3 border-b border-gray-200 ">
                <h5 className="text-left font-medium text-sm">
                  Layout block Properties
                </h5>
                {LayoutPropertyBlock ? (
                  <LayoutPropertyBlock blockInstance={foundSelectedBlock} />
                ) : (
                  <p className="text-red-500">
                    No properties component found for this block type
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallBlockPropertyBox;
