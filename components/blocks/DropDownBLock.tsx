"use client";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, X } from "lucide-react";
import { z } from "zod";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { updateChildBlock } from "@/redux/form/formSlice";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "Select";

type AttributeType = {
  label: string;
  required: boolean;
  placeHolder: string;
  options: string[];
};

const PropertiesValidationSchema = z.object({
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  options: z.array(z.string().min(1)),
  placeHolder: z.string().trim().optional(),
});

export const SelectFieldBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  blockBtnElement: {
    icon: ChevronDown,
    label: "Select Field",
  },
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Select Field",
      helperText: "",
      required: false,
      placeHolder: "Select",
      options: ["Option1", "Option2"],
    },
  }),

  canvasComponent: SelectFieldCanvasComponent,
  formComponent: SelectFieldFormComponent,
  propertiesComponent: SelectFieldPropertiesComponent,
  publicFormComponent: SelectPublicFormComponent,
};

type NewSelectBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function SelectFieldCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewSelectBlockInstance;
  const { helperText, label, placeHolder, required, options } =
    block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select>
        <SelectTrigger className="w-full disabled:cursor-default pointer-events-none cursor-default">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((option: string, index: number) =>
            option.trim().length > 0 ? ( // Check if the string is not empty
              <div className="flex items-center space-x-2" key={index}>
                <SelectItem value={option}>{option}</SelectItem>
              </div>
            ) : null
          )}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem] ">{helperText}</p>
      )}
    </div>
  );
}
function SelectFieldFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewSelectBlockInstance;
  const { helperText, label, placeHolder, required, options } =
    block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((option: string, index: number) => (
            <div className="flex items-center space-x-2" key={index}>
              <SelectItem value={option}>{option}</SelectItem>
            </div>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem] ">{helperText}</p>
      )}
    </div>
  );
}

function SelectFieldPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewSelectBlockInstance;
  const dispatch = useDispatch();

  // Form
  const form = useForm<z.infer<typeof PropertiesValidationSchema>>({
    resolver: zodResolver(PropertiesValidationSchema),
    defaultValues: {
      label: block.attributes.label,
      required: block.attributes.required,
      options: block.attributes.options,
      placeHolder: block.attributes.placeHolder,
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
      placeHolder: block.attributes.placeHolder,
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
          Select {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <form className="w-full space-y-3 px-4">
        {/* Label Field */}
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
        {/* Place holder */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Place Holder</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
            <Input
              {...register("placeHolder", {
                onChange: (e) => {
                  setChanges({
                    ...form.getValues(),
                    placeHolder: e.target.value,
                  });
                },
              })}
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
                  className="max-w-[150px] md:max-w-[187px] "
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
          <div className="w-full max-w-[150px] md:max-w-[187px]   text-end">
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

function SelectPublicFormComponent({
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
  const block = blockInstance as NewSelectBlockInstance;

  const { helperText, label, placeHolder, required, options } =
    block.attributes;
  const [isError, setIsError] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const fieldName = `${blockInstance.id}`;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base font-normal mb-2 ${
          errors[fieldName] ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={fieldName}
        control={control}
        rules={{
          required: required ? "This field is required" : false,
        }}
        render={({ field }) => (
          <Select {...field} onValueChange={field.onChange} value={field.value}>
            <SelectTrigger
              className={`w-full border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              }`}
            >
              <SelectValue placeholder={placeHolder} />
            </SelectTrigger>
            <SelectContent className="w-full">
              {options.map((option: string, index: number) => (
                <div className="flex items-center space-x-2" key={index}>
                  <SelectItem value={option}>{option}</SelectItem>
                </div>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {errors?.[fieldName] && (
        <p className="text-red-500 text-[0.8rem]">
          {errors[fieldName]?.message}
        </p>
      )}
    </div>
  );
}
