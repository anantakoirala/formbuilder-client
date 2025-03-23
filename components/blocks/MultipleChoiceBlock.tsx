import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, SquareCheck, X } from "lucide-react";
import { z } from "zod";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { updateChildBlock } from "@/redux/form/formSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "MultipleChoice";

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

export const MultipleChoiceBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  blockBtnElement: {
    icon: SquareCheck,
    label: "Multiple Choice",
  },
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Multiple Choice",
      helperText: "",
      required: false,
      placeHolder: "Select",
      options: ["Option1", "Option2"],
    },
  }),

  canvasComponent: MultipleChoiceCanvasComponent,
  formComponent: MultipleChoiceFormComponent,
  propertiesComponent: MultipleChoicePropertiesComponent,
  publicFormComponent: MultipleChoicePublicFormComponent,
};

type NewMultipleChoiceBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function MultipleChoiceCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewMultipleChoiceBlockInstance;

  const { label, options, required } = block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base font-normal mb-2">
        {label}
        {required && <span className="text-red-700">*</span>}
      </Label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div className="flex items-center space-x-2">
            <Checkbox className="disabled:cursor-default pointer-events-none cursor-default" />
            <Label className="font-normal cursor-pointer">{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
function MultipleChoiceFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewMultipleChoiceBlockInstance;

  const { label, options, required } = block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base font-normal mb-2">
        {label}
        {required && <span className="text-red-700">*</span>}
      </Label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div className="flex items-center space-x-2">
            <Checkbox className="" />
            <Label className="font-normal cursor-pointer">{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultipleChoicePropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewMultipleChoiceBlockInstance;
  const dispatch = useDispatch();

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
          Multiple Choice {positionIndex}
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
          <div className="w-full max-w-[150px] md:max-w-[187px]  text-end">
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
function MultipleChoicePublicFormComponent({
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
  const block = blockInstance as NewMultipleChoiceBlockInstance;

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
      {/* Label */}
      <Label
        className={`text-base font-normal mb-2 ${
          errors[fieldName] ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </Label>

      {/* Checkbox Group */}
      <Controller
        name={fieldName}
        control={control}
        rules={{
          validate: (value) =>
            required
              ? value?.length > 0 || "At least one option must be selected"
              : true,
        }}
        render={({ field }) => {
          return (
            <div className="flex flex-col gap-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value?.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(field.value || []), option] // Add to array
                        : field.value?.filter((val: string) => val !== option); // Remove from array
                      field.onChange(newValue);
                    }}
                    className={`${errors[fieldName] ? "border-red-500" : ""} `}
                  />
                  <Label>{option}</Label>
                </div>
              ))}
            </div>
          );
        }}
      />

      {/* Error Message */}
      {errors[fieldName] && (
        <p className="text-red-500 text-[0.8rem]">
          {errors[fieldName]?.message}
        </p>
      )}
    </div>
  );
}
