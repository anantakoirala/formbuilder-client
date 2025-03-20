import { fontSizeClass, fontWeightClass } from "@/constants";
import { updateChildBlock } from "@/redux/form/formSlice";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, TextIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
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

  createInstance: (id: string) => ({
    id,
    blockType,
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
  canvasComponent: ParagraphFormComponent,
  formComponent: ParagraphFormComponent,
  propertiesComponent: ParagraphPropertiesComponent, // Customizable properties editor
  publicFormComponent: ParagraphPublicFormComponent,
};

type NewParagraphBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

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
          <div className="w-full max-w-[187px]">
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
          <div className="w-full max-w-[187px]">
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
          <div className="w-full max-w-[187px]">
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
