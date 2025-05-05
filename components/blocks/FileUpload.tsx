import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { Upload, ChevronDown, GripVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { updateChildBlock } from "@/redux/form/formSlice";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { RootState } from "@/redux/store";

const PropertiesValidationSchema = z.object({
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  helperText: z.string().trim().max(255).optional(),
});

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "Fileupload";

export const FileUploadBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  blockBtnElement: {
    icon: Upload,
    label: "File Upload",
  },
  createInstance: (id: string, parentId?: string) => ({
    id,
    blockType,
    parentId,
    attributes: {
      label: "Upload File",
      helperText: "",
      required: false,
    },
  }),
  canvasComponent: FileUploadCanvasComponent,
  formComponent: FileUploadFormComponent,
  propertiesComponent: FileUploadPropertiesComponent,
  publicFormComponent: FileUploadPublicFormComponent,
  dragOverLayComponent: DragOverLayComponent,
};

function DragOverLayComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewFileBlockInstance;
  const { label, helperText, required } = block.attributes;
  return (
    <div
      className={`inline-block whitespace-nowrap px-2 py-1 rounded bg-white shadow text-left }`}
    >
      {label}
    </div>
  );
}

type NewFileBlockInstance = FormBlockInstance & {
  attributes: {
    label: string;
    helperText: string;
    required: boolean;
  };
};

function FileUploadCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewFileBlockInstance;
  const { label, helperText, required } = block.attributes;
  const { childBlockDisabled, form } = useSelector(
    (state: RootState) => state.form
  );

  const draggable = useDraggable({
    id: `${block.parentId}-file-${block.id}`,
    disabled: form.published,
    data: {
      blockType: block.blockType,
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
    },
  });

  const topCorner = useDroppable({
    id: `${block.parentId}-file-${block.id}-above`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: `${block.parentId}-file-${block.id}-below`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isBelow: true,
    },
  });

  return (
    <div className="relative group w-full py-2">
      {/* Top drop zone */}
      <div
        ref={topCorner.setNodeRef}
        className="absolute top-0 w-full h-[6px] -translate-y-full"
      >
        {topCorner.isOver && (
          <div className="w-full h-[6px] bg-primary rounded-t-md" />
        )}
      </div>

      {/* Drag handle and content */}
      <div
        ref={draggable.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
        className="relative flex flex-col gap-2 w-full pl-8"
      >
        <div className="absolute left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        <Label className="text-base font-normal mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        <Input
          type="file"
          readOnly
          className="pointer-events-none cursor-default h-10"
        />

        {helperText && (
          <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
        )}
      </div>

      {/* Bottom drop zone */}
      <div
        ref={bottomCorner.setNodeRef}
        className="absolute bottom-0 w-full h-[6px] translate-y-full"
      >
        {bottomCorner.isOver && (
          <div className="w-full h-[6px] bg-primary rounded-b-md" />
        )}
      </div>
    </div>
  );
}

function FileUploadFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewFileBlockInstance;
  const { label, helperText, required } = block.attributes;
  const [file, setFile] = useState<File | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const validateFile = (file: File | null) => {
    return required ? !!file : true;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base font-normal mb-2 ${
          isError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="file"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] || null;
          setFile(selectedFile);
          setIsError(!validateFile(selectedFile));
        }}
        className={`h-10 ${isError ? "border-red-500" : ""}`}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
      {isError && (
        <p className="text-red-500 text-[0.8rem]">
          {required ? "File is required" : ""}
        </p>
      )}
    </div>
  );
}

function FileUploadPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewFileBlockInstance;
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof PropertiesValidationSchema>>({
    resolver: zodResolver(PropertiesValidationSchema),
    defaultValues: {
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
    },
  });

  const { reset, register } = form;

  useEffect(() => {
    reset(block.attributes);
  }, [block.attributes]);

  const setChanges = (data: z.infer<typeof PropertiesValidationSchema>) => {
    if (!parentId) return;
    dispatch(
      updateChildBlock({
        parentId,
        childBlockId: block.id,
        updateChildBlock: {
          ...block,
          attributes: { ...block.attributes, ...data },
        },
      })
    );
  };

  return (
    <div className="w-full pb-4 ">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          FileUpload {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <form action="" className="w-full space-y-3 px-4">
        {/* Label */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Label</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Input
              {...register("label", {
                onChange: (e) => {
                  setChanges({ ...form.getValues(), label: e.target.value });
                },
              })}
            />
          </div>
        </div>

        {/* Helper text */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Helper Text</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Input
              {...register("helperText", {
                onChange: (e) => {
                  setChanges({
                    ...form.getValues(),
                    helperText: e.target.value,
                  });
                },
              })}
            />
          </div>
        </div>
        {/* Required Field */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Required</Label>
          <div className="w-full max-w-[187px]  text-end">
            <Switch
              checked={form.watch("required")}
              onCheckedChange={(value) => {
                form.setValue("required", value); // Updates form state
                setChanges({
                  ...form.getValues(),
                  required: value,
                });
              }}
              className=""
            />
          </div>
        </div>
      </form>
    </div>
    // <div className="w-full pb-4">
    //   <div className="w-full flex justify-between bg-gray-100 p-2 mb-2">
    //     <span className="text-sm font-medium text-gray-600">File Upload</span>
    //     <ChevronDown className="w-4 h-4" />
    //   </div>
    //   <form className="w-full space-y-3 px-4">
    //     <Label>Label</Label>
    //     <Input
    //       {...register("label", {
    //         onChange: (e) =>
    //           setChanges({ ...form.getValues(), label: e.target.value }),
    //       })}
    //     />
    //     <Label>Helper Text</Label>
    //     <Input
    //       {...register("helperText", {
    //         onChange: (e) =>
    //           setChanges({ ...form.getValues(), helperText: e.target.value }),
    //       })}
    //     />
    //     <Label>Required</Label>
    //     <Switch
    //       checked={form.watch("required")}
    //       onCheckedChange={(value) =>
    //         setChanges({ ...form.getValues(), required: value })
    //       }
    //     />
    //   </form>
    // </div>
  );
}

function FileUploadPublicFormComponent({
  blockInstance,
  register,
  errors,
  control,
}: {
  blockInstance: FormBlockInstance;
  register: any;
  errors: any;
  control: any;
}) {
  const block = blockInstance as NewFileBlockInstance;
  const { label, helperText, required } = block.attributes;
  const fieldName = `${blockInstance.id}`;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={errors?.[fieldName] ? "text-red-500" : ""}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input {...register(fieldName)} className="border" type="file" />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
      {errors?.[fieldName] && (
        <p className="text-red-500 text-[0.8rem]">
          {errors[fieldName]?.message}
        </p>
      )}
    </div>
  );
}
