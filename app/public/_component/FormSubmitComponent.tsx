"use client";
import { Button } from "@/components/ui/button";
import { FormBlocks } from "@/lib/form-blocks";
import { FormBlockInstance } from "@/types/FormCategory";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  formId: string;
  blocks: FormBlockInstance[];
};

const FormSubmitComponent = ({ formId, blocks }: Props) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formVals = useRef<{ [key: string]: string }>({});

  const form = useForm({ mode: "onBlur" });
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
  } = form;

  // const validateFields = () => {
  //   const errors: { [key: string]: string } = {};
  //   blocks.forEach((block) => {
  //     if (!block.childBlocks) return;
  //     block.childBlocks?.forEach((childblock) => {
  //       const required = childblock.attributes?.required;
  //       const blockValue = formVals.current?.[childblock.id]?.trim();

  //       // Check if field is required and empty
  //       if (required && (!blockValue || blockValue.trim() === "")) {
  //         errors[childblock.id] = "This Field is required";
  //       }
  //     });
  //   });
  //   setFormErrors(errors); // Update state with errors
  //   return Object.keys(errors).length === 0; // Return true if no errors
  // };

  // const handleBlur = (key: string, value: string) => {
  //   formVals.current[key] = value;

  //   if (formErrors[key] && value?.trim() !== "") {
  //     setFormErrors((prevErrors) => {
  //       const updatedErrors = { ...prevErrors };
  //       delete updatedErrors[key]; // Remove the key from errors
  //       return updatedErrors;
  //     });
  //   }
  // };
  const handleSubmitForm = async (data: any) => {
    console.log("formVals", data);
  };
  return (
    <div className="w-full h-full overflow-y-auto pt-3 transition-all duration-300">
      <div className="w-full h-full max-w-[650px] mx-auto">
        <div className="w-full relative bg-transparent px-2 flex flex-col items-center justify-start pt-1 pb-14 ">
          <div className="w-full mb-3 bg-white bg-[url(/form-bg.jpg)] bg-center bg-cover bg-no-repeat border shadow-sm h-[135px] max-w-[768px] rounded-md px-1"></div>
          <div className="w-full h-auto">
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="flex flex-col w-full gap-4">
                {blocks.map((block) => {
                  const FormBlockComponent =
                    FormBlocks[block.blockType].publicFormComponent;
                  return (
                    <FormBlockComponent
                      key={block.id}
                      blockInstance={block}
                      register={register}
                      errors={errors}
                      trigger={trigger}
                      control={control}
                    />
                  );
                })}
              </div>
              <div className="w-full mt-4">
                <Button className="bg-primary" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
