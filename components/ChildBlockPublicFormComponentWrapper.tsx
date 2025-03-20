import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import React from "react";

type Props = {
  blockInstance: FormBlockInstance;
  register: any;
  errors: any;
  trigger: any;
  control: any;
};

const ChildBlockPublicFormComponentWrapper = ({
  blockInstance,
  register,
  errors,
  trigger,
  control,
}: Props) => {
  const FormComponent =
    FormBlocks[blockInstance.blockType]?.publicFormComponent;
  if (!FormComponent) return null;
  return (
    <FormComponent
      blockInstance={blockInstance}
      register={register}
      errors={errors}
      trigger={trigger}
      control={control}
    />
  );
};

export default ChildBlockPublicFormComponentWrapper;
