"use client";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import {
  Active,
  DragEndEvent,
  useDndMonitor,
  useDroppable,
} from "@dnd-kit/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CanvasBlockLayoutWrapper from "./CanvasBlockLayoutWrapper";
import { allBlockLayouts } from "@/constants";
import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockType } from "@/types/FormCategory";
import { generateUniqueId } from "@/lib/generateUniqueId";
import { setBlocks } from "@/redux/form/formSlice";

type Props = {};

const BuilderCanvas = (props: Props) => {
  const dispatch = useDispatch();
  const { blockLayouts } = useSelector((state: RootState) => state.form);
  const [activeBlock, setActiveBlock] = useState<Active | null>(null);
  const droppable = useDroppable({
    id: "builder-canvas-droppable",
    data: {
      isBuilderCanvasDropArea: true,
    },
  });
  useDndMonitor({
    onDragStart: (event) => {
      setActiveBlock(event.active);
    },
    onDragEnd: (event: DragEndEvent) => {
      console.log("drag end", event);
      const { active, over } = event;
      if (!over || !active) return;
      setActiveBlock(null);

      const isBlockBtnElement = active?.data?.current?.isBlockBtnElement;
      const isBlockLayout = active?.data?.current?.blockType;

      const isDraggingOverCanvas = over.data?.current?.isBuilderCanvasDropArea;
      if (
        isBlockBtnElement &&
        allBlockLayouts.includes(isBlockLayout) &&
        isDraggingOverCanvas
      ) {
        const blockType = active.data?.current?.blockType;
        const newBlockLayout = FormBlocks[
          blockType as FormBlockType
        ].createInstance(generateUniqueId());

        dispatch(setBlocks(newBlockLayout));
        return;
      }
    },
  });
  return (
    <div className="relative w-full h-[calc(100vh-65px)] px-5 md:px-0 pt-4 pb-[120px] overflow-auto transition-all duration-300">
      <div className="w-full h-full max-w-[650px] mx-auto">
        {/* Dropable canvas */}
        <div
          ref={droppable.setNodeRef}
          className={cn(
            `w-full relative bg-transparent px-2 rounded-md flex flex-col min-h-svh items-center justify-start pt-1 pb-14 `,
            droppable.isOver && "ring-4 ring-primary/20 ring-inset"
          )}
        >
          <div className="w-full mb-3 bg-white bg-[url(/form-bg.jpg)] bg-center bg-cover bg-no-repeat border shadow-sm h-[135px] max-w-[768px] rounded-md px-1"></div>
          {blockLayouts.length > 0 && (
            <div className="flex flex-col w-full gap-4">
              {blockLayouts.map((blockLayout) => (
                <CanvasBlockLayoutWrapper
                  key={blockLayout.id}
                  blockLayout={blockLayout}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderCanvas;
