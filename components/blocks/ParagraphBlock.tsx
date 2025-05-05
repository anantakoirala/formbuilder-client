import { fontSizeClass, fontWeightClass } from "@/constants";
import { updateChildBlock } from "@/redux/form/formSlice";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, GripVertical, TextIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
const blockType: FormBlockType = "Paragraph";

type fontSizeType = "small" | "medium" | "large";

type fontWeightType = "normal" | "lighter";

type AttributeType = {
  label: string;
  text: string;
  fontSize: fontSizeType;
  fontWeight: fontWeightType;
};

const paragraphValidateSchema = z.object({
  text: z.string().trim().min(1).max(1000),
  fontSize: z.enum(["small", "medium", "large"]).default("small"),
  fontWeight: z.enum(["normal", "lighter"]).default("normal"),
});

export const ParagraphBlock: ObjectBlockType = {
  blockType,
  blockCategory,

  createInstance: (id: string, parentId?: string) => ({
    id,
    blockType,
    parentId,
    attributes: {
      label: "Paragraph",
      text: "Lorem ipsum dolor sit amet,consectetur adipiscing elit. Curabitur quis sem odio. Sed commodo vestibulum leo.",
      fontSize: "small",
      fontWeight: "normal",
    },
  }),

  // Button in the UI that allows the user to add a new block
  blockBtnElement: {
    icon: TextIcon,
    label: "Paragraph",
  },
  canvasComponent: ParagraphCanvasComponent,
  formComponent: ParagraphFormComponent,
  propertiesComponent: ParagraphPropertiesComponent, // Customizable properties editor
  publicFormComponent: ParagraphPublicFormComponent,
  dragOverLayComponent: DragOverLayComponent,
};

type NewParagraphBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function DragOverLayComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewParagraphBlockInstance;
  const { text, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`inline-block whitespace-nowrap px-2 py-1 rounded bg-white shadow text-left ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]}`}
    >
      <p>{text}</p>
    </div>
  );
}

function ParagraphFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewParagraphBlockInstance;
  const { text, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`w-full text-left ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]}`}
    >
      <p>{text}</p>
    </div>
  );
}

function ParagraphCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewParagraphBlockInstance;
  const { childBlockDisabled, form } = useSelector(
    (state: RootState) => state.form
  );
  const draggable = useDraggable({
    id: `${block.parentId}-paragraph-${block.id}`,
    disabled: form.published,
    data: {
      blockType: block.blockType,
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
    },
  });

  const topCorner = useDroppable({
    id: `${block.parentId}-paragraph-${block.id}-above`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: `${block.parentId}-paragraph-${block.id}-below`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isBelow: true,
    },
  });

  const { text, fontSize, fontWeight } = block.attributes;

  return (
    <div className="relative group w-full py-2 ">
      {/* Top dropzone */}
      <div
        ref={topCorner.setNodeRef}
        className="absolute top-0 w-full h-[6px] -translate-y-full"
      >
        {topCorner.isOver && (
          <div className="w-full h-[6px] bg-primary rounded-t-md" />
        )}
      </div>

      {/* Drag Handle + Text */}
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
          <p className="w-full">{text}</p>
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

function ParagraphPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewParagraphBlockInstance;
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof paragraphValidateSchema>>({
    resolver: zodResolver(paragraphValidateSchema),
    defaultValues: {
      text: block.attributes.text,
      fontSize: block.attributes.fontSize,
      fontWeight: block.attributes.fontWeight,
    },
    mode: "onBlur",
  });

  const { reset, register } = form;

  const setChanges = (data: z.infer<typeof paragraphValidateSchema>) => {
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
          Paragraph {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <form action="" className="w-full space-y-3 px-4">
        {/* Label */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Label</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Textarea
              {...register("text", {
                onChange: (e) => {
                  setChanges({ ...form.getValues(), text: e.target.value });
                },
              })}
              rows={4}
              placeholder="Enter your paragraph text here"
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
                <SelectItem value="light">Lighter</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </div>
  );
}

function ParagraphPublicFormComponent({
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
  const block = blockInstance as NewParagraphBlockInstance;
  const { text, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`w-full text-left ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]}`}
    >
      <p>{text}</p>
    </div>
  );
}
