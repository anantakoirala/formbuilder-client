"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { optional, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleApiError";
import { useCreateFormMutation } from "@/redux/form/formApi";
import { generateUniqueId } from "@/lib/generateUniqueId";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least two characters" }),
  description: z.string().optional(),
});

type Props = {
  createFormDialogOpen: boolean;
  setCreateFormDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const CreateFormDialog = ({
  createFormDialogOpen,
  setCreateFormDialogOpen,
}: Props) => {
  const [createForm] = useCreateFormMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = form;
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const jsonBlocks = [
        {
          id: `layout-` + generateUniqueId(),
          isLocked: false,
          blockType: "RowLayout",
          attributes: {},
          childBlocks: [
            {
              id: generateUniqueId(),
              blockType: "Heading",
              attributes: {
                label: data.name || "untitled",
                level: 1,
                fontSize: "4x-large",
                fontWeight: "normal",
              },
            },
            {
              id: generateUniqueId(),
              blockType: "Paragraph",
              attributes: {
                label: "Paragraph",
                text: data.description || "Add a description",
                fontSize: "small",
                fontWeight: "normal",
              },
            },
          ],
        },
      ];
      console.log("data", data);
      const updatedData = {
        ...data,
        jsonBlocks,
      };
      const response = await createForm(updatedData).unwrap();
      console.log("response", response);

      toast.success(response?.message || "Form created successfully!");
      setCreateFormDialogOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  return (
    <Dialog open={createFormDialogOpen} onOpenChange={setCreateFormDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Form</DialogTitle>
          <DialogDescription>
            {/* This action cannot be undone. This will permanently delete your
            account and remove your data from our servers. */}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mt-4">
              <input
                placeholder="Name"
                type="text"
                className="w-full bg-[#EFF0EB] text-gray-800 border-2 rounded-xl py-3.5 px-3 placeholder-gray-500 focus:outline-none"
                {...register("name")}
              />
              {errors && errors.name && (
                <span className="text-red-600 text-sm">
                  {errors?.name.message}
                </span>
              )}
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Description"
                className="w-full bg-[#EFF0EB] text-gray-800 border-2 rounded-xl py-3.5 px-3 placeholder-gray-500 focus:outline-none"
                {...register("description")}
              ></textarea>
              {errors && errors.description && (
                <span className="text-red-600 text-sm">
                  {errors?.description.message}
                </span>
              )}
            </div>
            <div className="mt-10">
              <button
                className="rounded-full w-full p-3 font-bold bg-primary hover:bg-secondary text-primary-foreground   disabled:bg-[#EFF0EB] disabled:text-[#A7AAA2]"
                type="submit"
                disabled={!watch("name")}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormDialog;
