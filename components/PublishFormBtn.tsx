"use client";
import React from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";
import { useUpdateFormMutation } from "@/redux/form/formApi";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

type Props = {};

const PublishFormBtn = (props: Props) => {
  const { form, blockLayouts } = useSelector((state: RootState) => state.form);
  const [updateForm, { isError, isLoading, isSuccess }] =
    useUpdateFormMutation();

  const { formId } = useParams();
  const tooglePublishState = async () => {
    const newFormPublishState = !form.published;
    if (formId && blockLayouts.length > 0) {
      try {
        await updateForm({
          data: { jsonBlocks: blockLayouts, published: newFormPublishState },
          formId: formId,
        }).unwrap();
        toast.success(
          `${
            newFormPublishState
              ? "Form published successfully"
              : "form unpublished"
          }`
        ); // Success toast
      } catch (error) {
        toast.error("Failed to publish form."); // Error toast
      }
    }
  };

  return (
    <Button
      disabled={isLoading}
      className={cn(
        `${
          form.published
            ? "bg-red-500 hover:bg-red-600"
            : "bg-primary text-white"
        }`
      )}
      size={"sm"}
      variant={form.published ? "destructive" : "default"}
      onClick={tooglePublishState}
    >
      {form.published ? (
        <>Unpublish</>
      ) : (
        <>
          <Send />
          Publish
        </>
      )}
    </Button>
  );
};

export default PublishFormBtn;
