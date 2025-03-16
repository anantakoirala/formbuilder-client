import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import React from "react";

type Props = {
  blockLayout: FormBlockInstance;
};

const CanvasBlockLayoutWrapper = ({ blockLayout }: Props) => {
  const CanvasBlockLayout = FormBlocks[blockLayout.blockType].canvasComponent;
  return (
    <div className="relative mb-1">
      <CanvasBlockLayout blockInstance={blockLayout} />
    </div>
  );
};

export default CanvasBlockLayoutWrapper;
