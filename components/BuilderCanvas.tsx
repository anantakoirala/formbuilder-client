"use client";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import {
  Active,
  DragEndEvent,
  useDndMonitor,
  useDroppable,
} from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allBlockLayouts } from "@/constants";
import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance, FormBlockType } from "@/types/FormCategory";
import { generateUniqueId } from "@/lib/generateUniqueId";
import {
  insertBlockInSpecificPosition,
  insertNewBlockAccordingToChildPosition,
  repositionChildBlock,
  setBlocks,
  setRepositionBlockLayout,
} from "@/redux/form/formSlice";

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
      const { active, over } = event;

      if (!over || !active) return;
      setActiveBlock(null);

      const isBlockBtnElement = active?.data?.current?.isBlockBtnElement;

      const isBlockLayout = active?.data?.current?.blockType;

      const isRowLayoutChildItem = active?.data?.current?.isRowLayoutChildItem;

      // Child element is dragged and dropped over or below child element
      if (isRowLayoutChildItem && over?.data?.current?.isRowLayoutChildItem) {
        const isDroppingOverChildBlockLayoutAbove =
          over?.data?.current?.isAbove;
        const isDroppingOverChildBlockLayoutBelow =
          over?.data?.current?.isBelow;

        const isDroppingOverChildLayout =
          isDroppingOverChildBlockLayoutAbove ||
          isDroppingOverChildBlockLayoutBelow;

        if (isDroppingOverChildLayout) {
          let position: "above" | "below" = "below";
          if (isDroppingOverChildBlockLayoutAbove) {
            position = "above";
          }

          dispatch(
            repositionChildBlock({
              overParentId: over?.data?.current?.parentId,
              overChildId: over?.data?.current?.blockId,
              activeParentId: active?.data?.current?.parentId,
              activeChildId: active?.data?.current?.blockId,
              position,
            })
          );

          return;
        }
      }

      const overChildElement = over?.data?.current?.isRowLayoutChildItem;

      // If block is dragged from sidebar and dropped over or below child element
      if (isBlockBtnElement && overChildElement) {
        const blockType = active.data?.current?.blockType;
        const newBlockLayout = FormBlocks[
          blockType as FormBlockType
        ].createInstance(generateUniqueId(), over?.data?.current?.parentId);

        const isDroppingOverChildBlockLayoutAbove =
          over?.data?.current?.isAbove;
        const isDroppingOverChildBlockLayoutBelow =
          over?.data?.current?.isBelow;

        const isDroppingOverChildLayout =
          isDroppingOverChildBlockLayoutAbove ||
          isDroppingOverChildBlockLayoutBelow;

        if (isDroppingOverChildLayout) {
          let position: "above" | "below" = "below";
          if (isDroppingOverChildBlockLayoutAbove) {
            position = "above";
          }

          dispatch(
            insertNewBlockAccordingToChildPosition({
              overParentId: over?.data?.current?.parentId,
              overChildId: over?.data?.current?.blockId,
              newBlockLayout,
              position,
            })
          );

          return;
        }
      }

      const isDraggingOverCanvas = over.data?.current?.isBuilderCanvasDropArea;
      // Checking if the row layout is directly dropped to the main canvas area not above or below the existing rowlayout in canvas
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

      const isDroppingOverCanvasBlockLayoutAbove = over?.data?.current?.isAbove;
      const isDroppingOverCanvasBlockLayoutBelow = over?.data?.current?.isBelow;

      const isDroppingOverCanvasLayout =
        isDroppingOverCanvasBlockLayoutAbove ||
        isDroppingOverCanvasBlockLayoutBelow;

      // New layout to a specific position
      const droppingLayoutBlockOverCanvas =
        isBlockBtnElement &&
        allBlockLayouts.includes(isBlockLayout) &&
        isDroppingOverCanvasLayout;

      if (droppingLayoutBlockOverCanvas) {
        const blockType = active.data?.current?.blockType;
        const overId = over?.data?.current?.blockId;

        const newBlockLayout = FormBlocks[
          blockType as FormBlockType
        ].createInstance(generateUniqueId());

        let position: "above" | "below" = "below";
        if (isDroppingOverCanvasBlockLayoutAbove) {
          position = "above";
        }

        dispatch(
          insertBlockInSpecificPosition({ overId, newBlockLayout, position })
        );
        //insertBlockLayoutAtIndex(overId, newBlockLayout, position);
        return;
      }

      // Changing position of existing Row block layouts

      const isDraggingCanvasLayout = active.data?.current?.isCanvasLayout;

      const draggingCanvasLayoutOverAnotherLayout =
        isDroppingOverCanvasLayout && isDraggingCanvasLayout;

      if (draggingCanvasLayoutOverAnotherLayout) {
        const activeId = active?.data?.current?.blockId;
        const overId = over?.data?.current?.blockId;

        let position: "above" | "below" = "below";
        if (isDroppingOverCanvasBlockLayoutAbove) {
          position = "above";
        }

        dispatch(setRepositionBlockLayout({ activeId, overId, position }));
        // repositionBlockLayout(activeId, overId, position);
        return;
      }
    },
  });

  const repositionBlockLayout = (
    activeId: string,
    overId: string,
    position: "above" | "below"
  ) => {
    // Find the indices of active and over blocks
    const activeIndex = blockLayouts.findIndex(
      (layout) => layout.id === activeId
    );
    const overIndex = blockLayouts.findIndex((layout) => layout.id === overId);

    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    // Remove the activeBlock from its current position
    const updatedBlocks = [...blockLayouts];
    const [movedBlock] = updatedBlocks.splice(activeIndex, 1);
    const insertIndex = position === "above" ? overIndex : overIndex + 1;

    updatedBlocks.splice(insertIndex, 0, movedBlock);
    console.log("updatedBlocks", updatedBlocks);
  };

  // const insertBlockLayoutAtIndex = (
  //   overId: string,
  //   newBlockLayout: FormBlockInstance,
  //   position: "above" | "below"
  // ) => {
  //   const overIndex = blockLayouts.findIndex((block) => block.id === overId);
  //   if (overIndex == -1) {
  //     return;
  //   }
  //   const insertIndex = position === "above" ? overIndex : overIndex + 1;
  //   const updatedBlocks = [...blockLayouts];
  //   updatedBlocks.splice(insertIndex, 0, newBlockLayout);
  // };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] px-5 md:px-0 pt-4 pb-[120px] overflow-auto transition-all duration-300">
      <div className="w-full h-full max-w-[650px] mx-auto ">
        {/* Dropable canvas */}
        <div
          ref={droppable.setNodeRef}
          className={cn(
            `w-full relative bg-transparent px-2 rounded-md flex flex-col min-h-svh items-center justify-start pt-1 pb-14 `,
            droppable.isOver &&
              blockLayouts.length >= 1 &&
              "ring-4 ring-primary/20 ring-inset"
          )}
        >
          {/* Initial image */}
          <div className="w-full mb-3 bg-white bg-[url(/form-bg.jpg)] bg-center bg-cover bg-no-repeat border shadow-sm h-[135px] max-w-[768px] rounded-md px-1"></div>
          {/* Row layouts */}
          {blockLayouts.length > 0 && (
            <div className="flex flex-col w-full gap-4">
              {blockLayouts.map((blockLayout) => (
                <CanvasBlockLayoutWrapper
                  key={blockLayout.id}
                  blockLayout={blockLayout}
                  activeBlock={activeBlock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
function CanvasBlockLayoutWrapper({
  blockLayout,
  activeBlock,
}: {
  blockLayout: FormBlockInstance;
  activeBlock: Active | null;
}) {
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
      {allBlockLayouts.includes(activeBlock?.data?.current?.blockType) &&
        !blockLayout.isLocked && (
          <div
            ref={topCorner.setNodeRef}
            className="
        absolute top-0 w-full h-1/2
        pointer-events-none
        "
          >
            {topCorner.isOver && (
              <div
                className="
           absolute w-full -top-[3px] h-[6px]
           bg-primary rounded-t-md
          "
              />
            )}
          </div>
        )}

      {/* Bottom Half Drop Zone */}
      {allBlockLayouts.includes(activeBlock?.data?.current?.blockType) &&
        !blockLayout.isLocked && (
          <div
            ref={bottomCorner.setNodeRef}
            className="
        absolute bottom-0 w-full h-1/2
        pointer-events-none 
        "
          >
            {bottomCorner.isOver && (
              <div
                className="
             absolute w-full -bottom-[3px] h-[6px]
             bg-primary rounded-b-md
            "
              />
            )}
          </div>
        )}

      <div className="relative">
        <CanvasBlockLayout blockInstance={blockLayout} />
      </div>
    </div>
  );
}

export default BuilderCanvas;
