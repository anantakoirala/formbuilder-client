"use client";
import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import { Active, useDroppable } from "@dnd-kit/core";
import React, { useEffect } from "react";

type Props = {
  blockLayout: FormBlockInstance;
  activeBlock: Active | null;
};

const CanvasBlockLayoutWrapper = ({ blockLayout, activeBlock }: Props) => {
  const CanvasBlockLayout = FormBlocks[blockLayout.blockType].canvasComponent;

  const topCorner = useDroppable({
    id: blockLayout.id + "_above",
    data: {
      blockType: blockLayout.blockType,
      blockId: blockLayout.id,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: blockLayout.id + "_below",
    data: {
      blockType: blockLayout.blockType,
      blockId: blockLayout.id,
      isBelow: true,
    },
  });

  return (
    <div className="relative mb-1">
      <div className="absolute top-0 w-full h-auto" ref={topCorner.setNodeRef}>
        {topCorner.isOver && !blockLayout.isLocked && (
          <div className="absolute w-full -top-[3px] h-[6px] bg-primary rounded-t-md"></div>
        )}
      </div>
      {/* Bottom dropzone */}
      <div
        className="absolute bottom-0 w-full h-auto"
        ref={bottomCorner.setNodeRef}
      >
        {bottomCorner.isOver && !blockLayout.isLocked && (
          <div className="absolute w-full -bottom-[3px] h-[6px] bg-primary rounded-b-md"></div>
        )}
      </div>
      <CanvasBlockLayout blockInstance={blockLayout} />
    </div>
  );
};

export default CanvasBlockLayoutWrapper;
