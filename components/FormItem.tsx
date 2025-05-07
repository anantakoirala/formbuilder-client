"use client";
import { Form } from "@/types/Form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ActivityIcon,
  Globe,
  LockKeyholeIcon,
  MessageSquareIcon,
  Trash2,
} from "lucide-react";

import DeleteFormDialog from "./DeleteFormDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Props = {
  form: Form;
};

const FormItem = ({ form }: Props) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const router = useRouter();

  return (
    <>
      <div
        className="w-full h-auto "
        role="button"
        onClick={() => router.push(`/dashboard/form/builder/${form.id}`)}
      >
        <div className="w-full relative bg-secondary flex items-center justify-center overflow-hidden h-[150px] rounded-t-xl border border-primary">
          <div className="w-36 absolute bottom-0 flex items-center flex-col px-4 pt-6 h-32 rounded-t-xl bg-white shadow-lg">
            <h5 className=" w-36 text-sm font-medium mb-1 text-center truncate text-muted-foreground break-words block ">
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
            <span className="text-sm flex items-center gap-1 font-medium min-w-0">
              {form.published ? (
                <Globe className="text-muted-foreground size-3 shrink-0" />
              ) : (
                <LockKeyholeIcon className="text-muted-foreground size-3 shrink-0" />
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate">{form.name}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{form.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>

            <Trash2
              className="text-gray-900 size-4 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
            />
          </div>

          <div className="flex w-full border-t border-gray-300 items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground items-center flex gap-1 font-[14px]">
                {form.responseCount}
                <MessageSquareIcon className="text-muted-foreground size-[14px]" />
              </span>
              <span className="text-muted-foreground items-center flex gap-1 font-[14px]">
                {form.views}
                <ActivityIcon className="text-muted-foreground size-[14px]" />
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
      <DeleteFormDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        formId={form.id}
      />
    </>
  );
};

export default FormItem;
