import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import React from "react";

type Props = {
  index: number;
  parentId: string;
  blockInstance: FormBlockInstance;
};

const ChildPropertiesComponentWrapper = ({
  index,
  parentId,
  blockInstance,
}: Props) => {
  const PropertiesComponent =
    FormBlocks[blockInstance.blockType].propertiesComponent;

  if (!PropertiesComponent) return null;
  return (
    <PropertiesComponent
      blockInstance={blockInstance}
      positionIndex={index}
      parentId={parentId}
    />
  );
};

export default ChildPropertiesComponentWrapper;
