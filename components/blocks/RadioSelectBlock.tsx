"use client";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, CircleIcon, GripVertical, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { updateChildBlock } from "@/redux/form/formSlice";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { generateUniqueId } from "@/lib/generateUniqueId";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { RootState } from "@/redux/store";

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
  createInstance: (id: string, parentId?: string) => ({
    id,
    blockType,
    parentId,
    attributes: {
      label: "Select an option",
      options: ["Option1", "Option2"],
      required: false,
    },
  }),

  canvasComponent: RadioSelectCanvasComponent,
  formComponent: RadioSelectFormComponent,
  propertiesComponent: RadioSelectPropertiesComponent,
  publicFormComponent: RadioPublicFormComponent,
  dragOverLayComponent: DragOverLayComponent,
};

function DragOverLayComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewBlockInstance;

  const { label, options, required } = block.attributes;
  return (
    <div
      className={`inline-block whitespace-nowrap px-2 py-1 rounded bg-white shadow text-left }`}
    >
      {label}
    </div>
  );
}

type NewBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function RadioSelectCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewBlockInstance;
  const { childBlockDisabled, form } = useSelector(
    (state: RootState) => state.form
  );
  const { label, options, required } = block.attributes;

  const draggable = useDraggable({
    id: `${block.parentId}-radio-${block.id}`,
    disabled: form.published,
    data: {
      blockType: block.blockType,
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
    },
  });

  const topCorner = useDroppable({
    id: `${block.parentId}-radio-${block.id}-above`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: `${block.parentId}-radio-${block.id}-below`,
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
          {required && <span className="text-red-700">*</span>}
        </Label>

        <RadioGroup
          disabled
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

function RadioSelectFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewBlockInstance;

  const { label, options, required } = block.attributes;
  const [isError, setIsError] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const validateField = (val: string) => {
    if (required) {
      return val.trim().length > 0;
    } else {
      return true;
    }
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base font-normal mb-2 ${
          isError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </Label>
      <RadioGroup
        className="space-y-3 "
        onValueChange={(value) => {
          setValue(value);
          const isValid = validateField(value);
          setIsError(!isValid);
        }}
      >
        {options.map((option: string, index: number) => {
          const uniqueId = `option-${generateUniqueId()}`;
          return (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem
                value={option}
                id={uniqueId}
                className={`cursor-pointer ${isError ? "border-red-500" : ""}`}
              />
              <Label htmlFor={uniqueId} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {isError && (
        <p className="text-red-500 text-[0.8rem]">
          {required && value.trim().length === 0
            ? "This field is required"
            : ""}
        </p>
      )}
    </div>
  );
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
                  className="max-w-[187px] "
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
                  className="p-0 absolute -right-1 -top-1 bg-black rounded-full w-4 h-4 -z-[10]"
                  onClick={() => {
                    const updatedOptions = form
                      .getValues("options")
                      .filter((_, i) => i !== index);
                    setChanges({
                      ...form.getValues(),
                      options: updatedOptions,
                    });
                  }}
                >
                  <X color="white" className="w-2.5 h-2.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant={"outline"}
              className="mt-2 bg-primary text-white"
              size={"sm"}
              onClick={() => {
                const currentOptions = form.getValues("options") || [];
                const newOption = `options${currentOptions.length + 1}`;
                const updatedOptions = [...currentOptions, newOption];
                setChanges({
                  ...form.getValues(),
                  options: updatedOptions,
                });
              }}
            >
              Add Options
            </Button>
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
  );
}

function RadioPublicFormComponent({
  blockInstance,
  register,
  errors,
  trigger,
  control,
}: {
  blockInstance: FormBlockInstance;
  register: any;
  errors: any;
  trigger: any;
  control: any;
}) {
  const block = blockInstance as NewBlockInstance;

  const { label, options, required } = block.attributes;
  const [isError, setIsError] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const fieldName = `${blockInstance.id}`;

  const validateField = (val: string) => {
    if (required) {
      return val.trim().length > 0;
    } else {
      return true;
    }
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base font-normal mb-2 ${
          isError || errors[fieldName] ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </Label>
      <Controller
        name={fieldName}
        control={control}
        rules={{
          required: required ? "This field is required" : false,
        }}
        render={({ field }) => (
          <RadioGroup
            {...field}
            className="space-y-3 "
            onValueChange={(value) => {
              setValue(value);
              const isValid = validateField(value);
              setIsError(!isValid);
            }}
          >
            {options.map((option: string, index: number) => {
              const uniqueId = `option-${generateUniqueId()}`;
              return (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem
                    value={option}
                    id={uniqueId}
                    className={`cursor-pointer ${
                      isError || errors?.[fieldName] ? "border-red-500" : ""
                    }`}
                  />
                  <Label
                    htmlFor={uniqueId}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}
      />
      {/* <RadioGroup
        className="space-y-3 "
        onValueChange={(value) => {
          setValue(value);
          const isValid = validateField(value);
          setIsError(!isValid);
        }}
      >
        {options.map((option: string, index: number) => {
          const uniqueId = `option-${generateUniqueId()}`;
          return (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem
                value={option}
                id={uniqueId}
                className={`cursor-pointer ${isError ? "border-red-500" : ""}`}
              />
              <Label htmlFor={uniqueId} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup> */}
      {errors?.[fieldName] && (
        <p className="text-red-500 text-[0.8rem]">
          {errors[fieldName]?.message}
        </p>
      )}
      {isError && (
        <p className="text-red-500 text-[0.8rem]">
          {required && value.trim().length === 0
            ? "This field is required"
            : ""}
        </p>
      )}
    </div>
  );
}
