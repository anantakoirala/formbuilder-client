"use client";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import BlockBtnDragOverLay from "./BlockBtnDragOverLay";
import { FormBlockType } from "@/types/FormCategory";
import { FormBlocks } from "@/lib/form-blocks";

type Props = {};

const BuilderDragOverLay = (props: Props) => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
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

  if (isBlockBtnElement) {
    const blockType = draggedItem?.data?.current?.blockType as FormBlockType;
    fallbackNode = <BlockBtnDragOverLay formBlock={FormBlocks[blockType]} />;
  }
  return (
    <DragOverlay>
      <div className="opacity-95">{fallbackNode}</div>
    </DragOverlay>
  );
};

export default BuilderDragOverLay;
