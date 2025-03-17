"use client";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import BlockBtnDragOverLay from "./BlockBtnDragOverLay";
import { FormBlockType } from "@/types/FormCategory";
import { FormBlocks } from "@/lib/form-blocks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Props = {};

const BuilderDragOverLay = (props: Props) => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { blockLayouts } = useSelector((state: RootState) => state.form);
  let fallbackNode = <div className="">No block drag</div>;
  useDndMonitor({
    onDragStart: (event) => {
      console.log("item drag", event);
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      console.log("itemDragCancel");
      setDraggedItem(null);
    },
    onDragEnd: () => {
      console.log("item drag end");
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;
  const isBlockBtnElement = draggedItem?.data?.current?.isBlockBtnElement;
  const isCanvasLayout = draggedItem?.data?.current?.isCanvasLayout;

  if (isBlockBtnElement) {
    const blockType = draggedItem?.data?.current?.blockType as FormBlockType;
    fallbackNode = <BlockBtnDragOverLay formBlock={FormBlocks[blockType]} />;
  }

  if (isCanvasLayout) {
    const blockId = draggedItem?.data?.current?.blockId;
    const blockLayout = blockLayouts.find((layout) => layout.id === blockId);
    if (!blockLayout) {
      fallbackNode = <div>No block drag</div>;
    } else {
      const CanvasBlockComponent =
        FormBlocks[blockLayout.blockType].canvasComponent;

      fallbackNode = (
        <div className="pointer-events-none">
          <CanvasBlockComponent blockInstance={blockLayout} />
        </div>
      );
    }
  }
  return (
    <DragOverlay>
      <div className="opacity-95">{fallbackNode}</div>
    </DragOverlay>
  );
};

export default BuilderDragOverLay;
