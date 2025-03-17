import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, CircleIcon, X } from "lucide-react";
import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { updateChildBlock } from "@/redux/form/formSlice";
import { Button } from "../ui/button";

type Props = {};

type AttributeType = {
  label: string;
  options: string[];
  required: boolean;
};

const PropertiesValidationSchema = z.object({
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  options: z.array(z.string().min(1)),
});

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "RadioSelect";

export const RadioSelectBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  blockBtnElement: {
    icon: CircleIcon,
    label: "Radio",
  },
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Select an option",
      options: ["Option1", "Option2"],
      required: false,
    },
  }),

  canvasComponent: RadioSelectCanvasComponent,
  formComponent: RadioSelectFormComponent,
  propertiesComponent: RadioSelectPropertiesComponent,
};

type NewBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function RadioSelectCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewBlockInstance;

  const { label, options, required } = block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base font-normal mb-2">
        {label}
        {required && <span className="text-red-700">*</span>}
      </Label>
      <RadioGroup
        disabled={true}
        className="space-y-3 disabled:cursor-default pointer-events-none cursor-default"
      >
        {options.map((option: string, index: number) => (
          <div className="flex items-center space-x-2" key={index}>
            <RadioGroupItem disabled value={option} id={option} />
            <Label htmlFor={option} className="font-normal">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function RadioSelectFormComponent() {
  return <div>Radio select form component</div>;
}

function RadioSelectPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewBlockInstance;
  const dispatch = useDispatch();
  // Form
  const form = useForm<z.infer<typeof PropertiesValidationSchema>>({
    resolver: zodResolver(PropertiesValidationSchema),
    defaultValues: {
      label: block.attributes.label,
      required: block.attributes.required,
      options: block.attributes.options,
    },
    mode: "onBlur",
  });

  const { reset, register } = form;

  // Reset form value when block attribute changes
  useEffect(() => {
    reset({
      label: block.attributes.label,
      required: block.attributes.required,
      options: block.attributes.options,
    });
  }, [block.attributes]);

  const setChanges = (data: z.infer<typeof PropertiesValidationSchema>) => {
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
      <div className="w-full flex items-center justify-between gap-1 bg-muted h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm fonts-medium text-gray-600 tracking-wider">
          Radio {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <form action="" onSubmit={() => {}} className="w-full space-y-3 px-4">
        {/* Label Field */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Label</Label>
          <div className="w-full max-w-[187px]">
            <Input
              {...register("label", {
                onChange: (e) => {
                  setChanges({ ...form.getValues(), label: e.target.value });
                },
              })}
              //   onKeyDown={(e) => {
              //     if (e.key === "Enter") {
              //       console.log("Enter key pressed");
              //     }
              //   }}
            />
          </div>
        </div>
        {/* Option Field */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Options</Label>
          <div className="flex flex-col gap-1">
            {form.watch("options").map((option, index) => (
              <div
                className="relative flex items-center justify-between gap-2"
                key={index}
              >
                <Input
                  className="max-w-[187px]"
                  {...register(`options.${index}`, {
                    onChange: (e) => {
                      const updatedOptions = [...form.getValues("options")];
                      updatedOptions[index] = e.target.value; // Update specific option
                      setChanges({
                        ...form.getValues(),
                        options: updatedOptions,
                      });
                    },
                  })}
                />
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  className="p-0 absolute -right-1 -top-1 bg-black rounded-full w-4 h-4"
                  onClick={() => {}}
                >
                  <X color="white" className="w-2.5 h-2.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
