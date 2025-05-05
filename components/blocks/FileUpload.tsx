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
  fileSize: z.number().min(1).max(2).default(1),
  fileTypes: z
    .array(z.string())
    .min(1, { message: "At least one file type must be selected" }),
  // e.g., ['image/png', 'application/pdf']
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
      fileSize: 1,
      fileTypes: ["image/png"],
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
    fileSize: number;
    fileTypes: string[];
  };
};

function FileUploadCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewFileBlockInstance;
  const { label, helperText, required, fileSize } = block.attributes;
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
          {label} <span className="text-xs ">{`(max:${fileSize}MB)`}</span>
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
      fileSize: block.attributes.fileSize ?? 1,
      fileTypes: block.attributes.fileTypes ?? ["image/png"],
    },
  });

  const {
    reset,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const fileTypes = watch("fileTypes") || [];

  useEffect(() => {
    reset(block.attributes);
  }, [block.attributes]);

  const setChanges = (
    rawData: Partial<z.infer<typeof PropertiesValidationSchema>>
  ) => {
    if (!parentId) return;

    const result = PropertiesValidationSchema.safeParse({
      ...form.getValues(),
      ...rawData,
    });

    if (!result.success) {
      // Manually set all field errors
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof z.infer<
          typeof PropertiesValidationSchema
        >;
        form.setError(fieldName, {
          type: "manual",
          message: err.message,
        });
      });
      return;
    }

    dispatch(
      updateChildBlock({
        parentId,
        childBlockId: block.id,
        updateChildBlock: {
          ...block,
          attributes: { ...block.attributes, ...rawData },
        },
      })
    );
  };

  return (
    <div className="w-full pb-4">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          FileUpload {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>

      <form className="w-full space-y-3 px-4">
        {/* Label */}
        <div className="flex flex-col gap-1">
          <Label className="text-[13px] font-normal">Label</Label>
          <Input
            {...register("label", {
              onChange: (e) => setChanges({ label: e.target.value }),
            })}
          />
          {errors.label && (
            <span className="text-xs text-red-500">{errors.label.message}</span>
          )}
        </div>

        {/* Helper Text */}
        <div className="flex flex-col gap-1">
          <Label className="text-[13px] font-normal">Helper Text</Label>
          <Input
            {...register("helperText", {
              onChange: (e) => setChanges({ helperText: e.target.value }),
            })}
          />
          {errors.helperText && (
            <span className="text-xs text-red-500">
              {errors.helperText.message}
            </span>
          )}
        </div>

        {/* File Size */}
        <div className="flex flex-col gap-1">
          <Label className="text-[13px] font-normal">File Size (MB)</Label>
          <Input
            type="number"
            {...register("fileSize", {
              valueAsNumber: true,
              onChange: (e) => setChanges({ fileSize: Number(e.target.value) }),
            })}
          />
          {errors.fileSize && (
            <span className="text-xs text-red-500">
              {errors.fileSize.message}
            </span>
          )}
        </div>
        {/* File Types */}
        <div className="flex flex-col gap-1">
          <Label className="text-[13px] font-normal">
            File Types (MIME Types)
          </Label>
          <div className="flex flex-wrap gap-2">
            {["image/png", "image/jpeg", "application/pdf"].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={type}
                  value={type}
                  checked={fileTypes.includes(type)} // Corrected check
                  onChange={(e) => {
                    if (e.target.checked) {
                      setChanges({
                        fileTypes: [...fileTypes, type], // Add type to array if checked
                      });
                    } else {
                      setChanges({
                        fileTypes: fileTypes.filter((t: string) => t !== type), // Remove type from array if unchecked
                      });
                    }
                  }}
                />
                <Label htmlFor={type} className="text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </div>
          {errors.fileTypes && (
            <span className="text-xs text-red-500">
              {errors.fileTypes.message}
            </span>
          )}
        </div>

        {/* Required */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Required</Label>
          <div className="w-full max-w-[187px] text-end">
            <Switch
              checked={watch("required")}
              onCheckedChange={(value) => {
                setValue("required", value);
                setChanges({ required: value });
              }}
            />
          </div>
        </div>
      </form>
    </div>
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
  const { label, helperText, required, fileSize, fileTypes } = block.attributes;
  const fieldName = `${blockInstance.id}`;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={errors?.[fieldName] ? "text-red-500" : ""}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        {...register(fieldName, {
          validate: (fileList: FileList) => {
            const file = fileList?.[0];

            if (required && !file) {
              return "This file is required.";
            }

            if (file && fileSize && file.size > fileSize * 1024 * 1024) {
              return `File must be smaller than ${fileSize}MB.`;
            }

            if (file && fileTypes && !fileTypes.includes(file.type)) {
              return `Invalid file type. Allowed types: ${fileTypes.join(
                ", "
              )}.`;
            }

            return true;
          },
        })}
        type="file"
        className={`border ${errors?.[fieldName] ? "border-red-500" : ""}`}
      />
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
