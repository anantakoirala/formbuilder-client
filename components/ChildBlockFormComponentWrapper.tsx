import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import React from "react";

type Props = {
  blockInstance: FormBlockInstance;
};

const ChildBlockFormComponentWrapper = ({ blockInstance }: Props) => {
  const FormComponent = FormBlocks[blockInstance.blockType]?.formComponent;
  if (!FormComponent) return null;
  return <FormComponent blockInstance={blockInstance} />;
};

export default ChildBlockFormComponentWrapper;
