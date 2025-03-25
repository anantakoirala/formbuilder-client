"use client";
import { Form } from "@/types/Form";
import { useRouter } from "next/navigation";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ActivityIcon,
  EllipsisIcon,
  Globe,
  LockKeyholeIcon,
  MessageSquareIcon,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";
import { useDeleteFormMutation } from "@/redux/form/formApi";

type Props = {
  form: Form;
};

const FormItem = ({ form }: Props) => {
  const [trigger] = useDeleteFormMutation();
  const router = useRouter();

  const deleteForm = async (formId: number) => {
    try {
      await trigger({ id: formId }).unwrap();
      toast.success("Form deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div
      className="w-full h-auto "
      role="button"
      onClick={() => router.push(`/dashboard/form/builder/${form.id}`)}
    >
      <div className="w-full relative bg-secondary flex items-center justify-center overflow-hidden h-[150px] rounded-t-xl border border-primary">
        <div className="w-36 absolute bottom-0 flex items-center flex-col px-4 pt-6 h-32 rounded-t-xl bg-white shadow-lg">
          <h5 className="text-sm font-medium mb-1 text-center truncate text-muted-foreground block w-[200px]">
            {form.name}
          </h5>
          {[0, 1, 2].map((number, index) => (
            <div className="flex items-center gap-1 mb-2" key={index}>
              <Skeleton className="h-3 w-3 rounded-full shrink-0" />
              <Skeleton className="h-3 w-[75px]" />
            </div>
          ))}
        </div>
      </div>
      <div className=" w-full py-0">
        <div className="flex w-full items-center justify-between py-1">
          <span className="text-sm flex items-center gap-1 font-medium">
            {form.published ? (
              <Globe className="text-muted-foreground size-3" />
            ) : (
              <LockKeyholeIcon className="text-muted-foreground size-3" />
            )}
            {form.name}
          </span>
          <Trash2
            className="text-gray-900 size-4"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              // Show confirmation dialog before proceeding with the delete action
              const isConfirmed = window.confirm(
                "Are you sure you want to delete this form?"
              );

              if (isConfirmed) {
                deleteForm(form.id);
              } else {
                console.log("Form deletion canceled.");
              }
            }}
          />
        </div>
        <div className="flex w-full border-t border-gray-300 items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground items-center flex gap-1 font-[14px]">
              {form.responseCount}
              <MessageSquareIcon className="text-muted-foreground s-ze-[14px]" />
            </span>
            <span className="text-muted-foreground items-center flex gap-1 font-[14px]">
              {form.views}
              <ActivityIcon className="text-muted-foreground s-ze-[14px]" />
            </span>
          </div>
          <span className="text-muted-foreground flex gap-1 text-[13px]">
            {formatDistanceToNowStrict(new Date(form.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormItem;
