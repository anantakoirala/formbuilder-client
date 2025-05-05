"use client";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useMemo, useState } from "react";
import BlockBtnDragOverLay from "./BlockBtnDragOverLay";
import { FormBlockType } from "@/types/FormCategory";
import { FormBlocks } from "@/lib/form-blocks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setChildBlockDisabled } from "@/redux/form/formSlice";

type Props = {};

const BuilderDragOverLay = (props: Props) => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { blockLayouts } = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  const fallbackNode = useMemo(() => {
    if (!draggedItem) return null;

    const data = draggedItem.data?.current || {};
    const { isBlockBtnElement, isCanvasLayout, isRowLayoutChildItem } = data;

    if (isBlockBtnElement) {
      dispatch(setChildBlockDisabled(false));
    }

    if (isRowLayoutChildItem) {
      console.log("first");
      dispatch(setChildBlockDisabled(false));

      const blockType = data.blockType as FormBlockType;
      const blockId = data.blockId;
      const parentId = data.parentId;
      console.log("parentId", parentId);
      const blockLayout = blockLayouts.find((layout) => layout.id === parentId);
      if (!blockLayout || !blockLayout.childBlocks) {
        return <div>No block drag</div>;
      }

      const childBlock = blockLayout.childBlocks.find(
        (child) => child.id === blockId
      );
      console.log("childBlock", blockLayout);
      console.log("blockId", blockType);

      if (childBlock) {
        const ChildBlockComponent =
          FormBlocks[childBlock.blockType].dragOverLayComponent;
        return (
          <div className="pointer-events-none">
            <ChildBlockComponent blockInstance={childBlock} />
          </div>
        );
      }

      return <div>No block drag</div>;
    }

    if (isBlockBtnElement) {
      console.log("second");
      const blockType = data.blockType as FormBlockType;
      return <BlockBtnDragOverLay formBlock={FormBlocks[blockType]} />;
    }

    if (isCanvasLayout) {
      console.log("third");
      const blockId = data.blockId;
      const blockLayout = blockLayouts.find((layout) => layout.id === blockId);
      if (!blockLayout) return <div>No block drag</div>;

      const CanvasBlockComponent =
        FormBlocks[blockLayout.blockType].canvasComponent;
      return (
        <div className="pointer-events-none">
          <CanvasBlockComponent blockInstance={blockLayout} />
        </div>
      );
    }

    return <div>No block drag</div>;
  }, [draggedItem, blockLayouts, dispatch]);

  if (!fallbackNode) return null;

  return (
    <DragOverlay>
      <div className="opacity-95">{fallbackNode}</div>
    </DragOverlay>
  );
};

export default BuilderDragOverLay;
