import { fontSizeClass, fontWeightClass } from "@/constants";
import { updateChildBlock } from "@/redux/form/formSlice";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, GripVertical, HeadingIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { RootState } from "@/redux/store";

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "Heading";

type fontSizeType =
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "2x-large"
  | "4x-large";
type fontWeightType = "normal" | "bold" | "bolder" | "lighter";

type AttributeType = {
  label: string;
  level: 1 | 2 | 3 | 4 | 5 | 6; // Corresponds to heading levels (h1 - h6)
  fontSize: fontSizeType;
  fontWeight: fontWeightType;
};

const propertiesValidateSchema = z.object({
  label: z.string().trim().min(2).max(255),
  level: z.number().min(1).max(6).default(1), // Defaults to H1
  fontSize: z
    .enum(["small", "medium", "large", "x-large", "2x-large", "4x-large"])
    .default("medium"),
  fontWeight: z.enum(["normal", "bold", "bolder", "lighter"]).default("normal"),
});

export const HeadingBlock: ObjectBlockType = {
  blockType,
  blockCategory,
  createInstance: (id: string, parentId?: string) => ({
    id,
    blockType,
    parentId,
    attributes: {
      label: "Heading",
      level: 1, // Default to H1
      fontSize: "medium",
      fontWeight: "normal",
    },
  }),
  blockBtnElement: {
    icon: HeadingIcon,
    label: "Heading",
  },
  canvasComponent: HeadingCanvasComponent,
  formComponent: HeadingFormComponent,
  propertiesComponent: HeadingPropertiesComponent,
  publicFormComponent: HeadingPublicFormComponent,
  dragOverLayComponent: DragOverLayComponent,
};

function DragOverLayComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewHeadingBlockInstance;
  const { level, label, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`inline-block whitespace-nowrap px-2 py-1 rounded bg-white shadow text-left }`}
    >
      {label}
    </div>
  );
}
type NewHeadingBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function HeadingCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewHeadingBlockInstance;
  const { childBlockDisabled, form } = useSelector(
    (state: RootState) => state.form
  );

  const draggable = useDraggable({
    id: `${block.parentId}-heading-${block.id}`,
    disabled: form.published,
    data: {
      blockType: block.blockType,
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
    },
  });

  const { level, label, fontSize, fontWeight } = block.attributes;

  const topCorner = useDroppable({
    id: `${block.parentId}-heading-${block.id}-above`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: `${block.parentId}-heading-${block.id}-below`,
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
      {/* Top dropzone */}
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
        className="relative flex items-center pl-8"
      >
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div
          className={`w-full text-left ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]}`}
        >
          {React.createElement(
            `h${level}`, // Dynamically create heading tag based on 'level'
            {}, // No additional props for the heading element
            label // Label for the heading
          )}
        </div>
      </div>

      {/* Bottom dropzone */}
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

function HeadingFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewHeadingBlockInstance;
  const { level, label, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`w-full text-left ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]}`}
    >
      {React.createElement(
        `h${level}`, // Dynamically create heading tag based on 'level'
        {}, // No additional props for the heading element
        label // Label for the heading
      )}
    </div>
  );
}

function HeadingPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewHeadingBlockInstance;
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof propertiesValidateSchema>>({
    resolver: zodResolver(propertiesValidateSchema),
    defaultValues: {
      label: block.attributes.label,
      fontSize: block.attributes.fontSize,
      fontWeight: block.attributes.fontWeight,
      level: block.attributes.level,
    },
    mode: "onBlur",
  });

  const { reset, register } = form;

  useEffect(() => {
    reset({
      label: block.attributes.label,
      fontSize: block.attributes.fontSize,
      fontWeight: block.attributes.fontWeight,
      level: block.attributes.level,
    });
  }, [block.attributes]);

  const setChanges = (data: z.infer<typeof propertiesValidateSchema>) => {
    if (!parentId) return;
    // Update child block
    console.log("data", data);
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
    <div className="w-full pb-4">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Heading {positionIndex}
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
        {/* Font Size */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Font Size</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Select
              defaultValue={block.attributes.fontSize}
              onValueChange={(value: fontSizeType) => {
                setChanges({
                  ...form.getValues(),
                  fontSize: value,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Font Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="x-large">Xtra Large</SelectItem>
                <SelectItem value="2x-large">2Xtra Large</SelectItem>
                <SelectItem value="4x-large">4Xtra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Weight */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Weight</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Select
              defaultValue={block.attributes.fontWeight}
              onValueChange={(value: fontWeightType) => {
                setChanges({
                  ...form.getValues(),
                  fontWeight: value,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Font Weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="bolder">Bolder</SelectItem>
                <SelectItem value="lighter">Lighter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Heading Level */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Level</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Select
              defaultValue={String(block.attributes.level)}
              onValueChange={(value: fontWeightType) => {
                setChanges({
                  ...form.getValues(),
                  level: Number(value),
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Heading Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
                <SelectItem value="6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </div>
  );
}
function HeadingPublicFormComponent({
  blockInstance,
  register,
  errors,
  trigger,
}: {
  blockInstance: FormBlockInstance;
  register: any;
  errors: any;
  trigger: any;
}) {
  const block = blockInstance as NewHeadingBlockInstance;
  const { level, label, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`w-full text-left ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]}`}
    >
      {React.createElement(
        `h${level}`, // Dynamically create heading tag based on 'level'
        {}, // No additional props for the heading element
        label // Label for the heading
      )}
    </div>
  );
}
