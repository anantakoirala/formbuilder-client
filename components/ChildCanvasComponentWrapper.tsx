import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import React from "react";

type Props = {
  blockInstance: FormBlockInstance;
};

const ChildCanvasComponentWrapper = ({ blockInstance }: Props) => {
  const ChildCanvasComponent =
    FormBlocks[blockInstance.blockType]?.canvasComponent;
  if (!ChildCanvasComponent) return null;
  return <ChildCanvasComponent blockInstance={blockInstance} />;
};

export default ChildCanvasComponentWrapper;
