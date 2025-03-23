"use client";
import React from "react";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { useUpdateFormMutation } from "@/redux/form/formApi";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type Props = {};

const SaveFormBtn = (props: Props) => {
  const { blockLayouts, form } = useSelector((state: RootState) => state.form);
  const [updateForm, { isError, isLoading, isSuccess }] =
    useUpdateFormMutation();
  const { formId } = useParams();
  const saveForm = async () => {
    if (formId && blockLayouts.length > 0) {
      try {
        await updateForm({
          data: { jsonBlocks: blockLayouts, published: false },
          formId: formId,
        }).unwrap();
        toast.success("Form saved successfully!"); // Success toast
      } catch (error) {
        toast.error("Failed to save form."); // Error toast
      }
    }
  };

  return (
    <Button
      size={"sm"}
      variant={"outline"}
      className={cn(
        `
        shrink-0 text-primary bg-primary/10 border-primary flex items-center gap-1 md:gap-2 px-1 md:px-3
            `,
        form?.published && "cursor-default pointer-events-none"
      )}
      onClick={() => saveForm()}
      disabled={isLoading}
    >
      <Save />
      <span className=" text-xs">Save</span>
    </Button>
  );
};

export default SaveFormBtn;
