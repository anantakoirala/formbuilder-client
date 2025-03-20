import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, LetterTextIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { updateChildBlock } from "@/redux/form/formSlice";
import { Switch } from "../ui/switch";

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "TextArea";

type AttributeType = {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  rows: number;
};

const propertiesValidateSchema = z.object({
  placeHolder: z.string().trim().optional(),
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  helperText: z.string().trim().max(255).optional(),
  rows: z.number().min(1).max(20).default(3),
});

export const TextAreaBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  blockBtnElement: {
    icon: LetterTextIcon,
    label: "Text Area",
  },
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Text Area",
      helperText: "",
      required: false,
      placeHolder: "Enter Text",
      rows: 3,
    },
  }),

  canvasComponent: TextAreaCanvasComponent,
  formComponent: TextAreaFormComponent,
  propertiesComponent: TextAreaPropertiesComponent,
  publicFormComponent: TextAreaPublicFormComponent,
};

type NewTextAreaBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function TextAreaCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextAreaBlockInstance;
  const { helperText, label, placeHolder, required, rows } = block.attributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base !font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        placeholder={placeHolder}
        rows={rows || 3} // Default row value if not provided
        cols={50} // Default column value if not provided
        readOnly
        className="resize-none !min-h-[50px] !pointer-events-none cursor-default"
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}
function TextAreaFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextAreaBlockInstance;
  const { label, placeHolder, required, helperText, rows } = block.attributes;

  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);

  const validateField = (val: string) => {
    if (required) {
      return val.trim().length > 0; // Validation: Required fields must not be empty.
    }
    return true; // If not required, always valid.
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
      <Textarea
        placeholder={placeHolder}
        rows={rows || 3}
        cols={50}
        className={`resize-none !min-h-[50px] ${
          isError ? "border-red-500" : ""
        }`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={(event) => {
          const inputValue = event.target.value;
          const isValid = validateField(inputValue);
          setIsError(!isValid);
        }}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
      {isError ? (
        <p className="text-red-500 text-[0.8rem]">
          {required && value.trim().length === 0
            ? `This field is required.`
            : ""}
        </p>
      ) : null}
    </div>
  );
}
function TextAreaPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextAreaBlockInstance;
  const dispatch = useDispatch();
  // Use the form hook to manage the form state and validation
  const form = useForm<z.infer<typeof propertiesValidateSchema>>({
    resolver: zodResolver(propertiesValidateSchema),
    defaultValues: {
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
      rows: block.attributes.rows,
    },
    mode: "onBlur",
  });
  const { reset, register } = form;

  useEffect(() => {
    reset({
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeHolder: block.attributes.placeHolder,
      rows: block.attributes.rows,
    });
  }, [block.attributes]);

  const setChanges = (data: z.infer<typeof propertiesValidateSchema>) => {
    if (!parentId) return;
    // Update child block
    console.log("data change", data);
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
        {/* Rows */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Rows</Label>
          <div className="w-full max-w-[187px]">
            <Input
              type="number"
              {...register("rows", {
                valueAsNumber: true, // Converts input value to a number
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

function TextAreaPublicFormComponent({
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
  const block = blockInstance as NewTextAreaBlockInstance;
  const { label, placeHolder, required, helperText, rows } = block.attributes;

  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);
  const validateField = (val: string) => {
    if (required) {
      return val.trim().length > 0; // Validation: Required fields must not be empty.
    }
    return true; // If not required, always valid.
  };
  const fieldName = `${blockInstance.id}-textarea`;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base !font-normal mb-2 ${
          errors?.[fieldName] || isError ? "text-red-500" : ""
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
          <Textarea
            {...field}
            placeholder={placeHolder}
            rows={rows || 3}
            cols={50}
            className={`resize-none !min-h-[50px] ${
              errors?.[fieldName] || isError ? "border-red-500" : ""
            }`}
            onBlur={(event) => {
              const inputValue = event.target.value;
              const isValid = validateField(inputValue);
              setIsError(!isValid);
              if (inputValue.length > 0) {
                field.onBlur(); // Trigger the onBlur method from the `Controller`
              }
            }}
            onChange={(event) => {
              field.onChange(event.target.value); // data send back to hook form
              if (event.target.value.length > 0) {
                setIsError(false);
              } else {
                setIsError(true);
              }
              //setValue(event.target.value) // UI state
            }}
          />
        )}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
      {errors?.[fieldName] && (
        <p className="text-red-500 text-[0.8rem]">
          {errors[fieldName]?.message}
        </p>
      )}
      {isError && !errors[fieldName] ? (
        <p className="text-red-500 text-[0.8rem]">
          {required && value.trim().length === 0
            ? `This field is required.`
            : ""}
        </p>
      ) : null}
    </div>
  );
}
