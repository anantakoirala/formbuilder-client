import { ObjectBlockType } from "@/types/FormCategory";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

const BlockBtnElements = ({
  formBlock,
  disabled,
}: {
  formBlock: ObjectBlockType;
  disabled?: boolean;
}) => {
  const { icon: Icon, label } = formBlock.blockBtnElement;
  const draggable = useDraggable({
    id: `block-btn-${formBlock.blockType}`,
    disabled: disabled,
    data: {
      blockType: formBlock.blockType,
      isBlockBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      disabled={disabled}
      className={cn(
        `
        flex flex-col gap-2
        h-[75px] w-[86px] cursor-grab
        !bg-white border
        text-gray-600
        hover:bg-white hover:ring-1
        hover:!ring-primary`,
        draggable.isDragging && "ring-2 ring-primary shadow-xl",
        disabled && "!cursor-default !pointer-events-none"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="w-8 h-8 stroke-[0.9] cursor-grab" />
      <h5
        className="text-[11.4px] -mt-1  text-gray-600"
        style={{ fontWeight: 500 }}
      >
        {label}
      </h5>
    </Button>
  );
};

export default BlockBtnElements;
