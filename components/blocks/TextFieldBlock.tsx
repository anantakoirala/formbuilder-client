import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, TextCursorInput } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { useDispatch } from "react-redux";
import { updateChildBlock } from "@/redux/form/formSlice";

type Props = {};

type AttributeType = {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
};

const PropertiesValidationSchema = z.object({
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  placeHolder: z.string().trim().optional(),
  helperText: z.string().trim().max(255).optional(),
});

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "TextField";

export const TextFieldBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  blockBtnElement: {
    icon: TextCursorInput,
    label: "Text Field",
  },
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Text Field",
      helperText: "",
      required: false,
      placeHolder: "Enter Text",
    },
  }),

  canvasComponent: TextFieldCanvasComponent,
  formComponent: TextFieldFormComponent,
  propertiesComponent: TextFieldPropertiesComponent,
};

type NewTextBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function TextFieldCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextBlockInstance;
  const { helperText, label, placeHolder, required } = block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        readOnly
        className="pointer-events-none cursor-default h-10"
        placeholder={placeHolder}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem] ">{helperText}</p>
      )}
    </div>
  );
}

function TextFieldFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextBlockInstance;
  const { label, helperText, required, placeHolder } = block.attributes;
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
        className={`text-base !font-normal mb-2 ${
          isError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={(e) => {
          const inputValue = e.target.value;
          const isValid = validateField(inputValue);
          setIsError(!isValid);
        }}
        className={`h-10 ${isError ? "border-red-500" : ""}`}
        placeholder={placeHolder}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem] ">{helperText}</p>
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

function TextFieldPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextBlockInstance;
  const dispatch = useDispatch();
  // Use the form hook to manage the form state and validation
  const form = useForm<z.infer<typeof PropertiesValidationSchema>>({
    resolver: zodResolver(PropertiesValidationSchema),
    defaultValues: {
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
    },
    mode: "onBlur",
  });

  const { reset, register } = form;

  useEffect(() => {
    reset({
      label: block.attributes.label,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
      helperText: block.attributes.helperText,
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
    <div className="w-full pb-4 ">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Textarea {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
      <form action="" className="w-full space-y-3 px-4">
        {/* Label */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Label</Label>
          <div className="w-full max-w-[187px]">
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
          <div className="w-full max-w-[187px]">
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
        {/* Helper text */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Helper Text</Label>
          <div className="w-full max-w-[187px]">
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
  );
}
