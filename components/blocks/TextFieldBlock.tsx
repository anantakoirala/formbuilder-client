import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, GripVertical, TextCursorInput } from "lucide-react";
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
  createInstance: (id: string, parentId?: string) => ({
    id,
    blockType,
    parentId,
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
  publicFormComponent: TextPublicFormComponent,
  dragOverLayComponent: DragOverLayComponent,
};

function DragOverLayComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextBlockInstance;
  const { label, placeHolder, required, helperText } = block.attributes;
  return (
    <div
      className={`inline-block whitespace-nowrap px-2 py-1 rounded bg-white shadow text-left }`}
    >
      {label}
    </div>
  );
}

type NewTextBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function TextFieldCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewTextBlockInstance;
  const { label, placeHolder, required, helperText } = block.attributes;
  const { childBlockDisabled, form } = useSelector(
    (state: RootState) => state.form
  );
  const draggable = useDraggable({
    id: `${block.parentId}-textfield-${block.id}`,
    disabled: form.published,
    data: {
      blockType: block.blockType,
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
    },
  });

  const topCorner = useDroppable({
    id: `${block.parentId}-textfield-${block.id}-above`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: `${block.parentId}-textfield-${block.id}-below`,
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

      {/* Drag handle + Input content */}
      <div
        ref={draggable.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
        className="relative flex items-start pl-8"
      >
        {/* Drag handle */}
        <div className="absolute left-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* Input UI */}
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-base font-normal">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            readOnly
            className="pointer-events-none cursor-default h-10"
            placeholder={placeHolder}
          />
          {helperText && (
            <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
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
          Text {positionIndex}
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
        {/* Helper text */}
        <div className="flex items-baseline justify-between w-full gap-2">
          <Label className="text-[13px] font-normal">Helper Text</Label>
          <div className="w-full max-w-[150px] md:max-w-[187px]">
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

function TextPublicFormComponent({
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
  const block = blockInstance as NewTextBlockInstance;
  const { label, helperText, required, placeHolder } = block.attributes;
  const [isError, setIsError] = useState<boolean>(false);

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
        defaultValue="" // ✅ Set an initial value to prevent uncontrolled warning
        rules={{
          required: required ? "This field is required" : false,
        }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder={placeHolder}
            className={`h-10 ${
              errors[fieldName] || isError ? "border-red-500" : ""
            }`}
            onBlur={(event) => {
              const inputValue = event.target.value;
              const isValid = validateField(inputValue);
              setIsError(!isValid);
              if (inputValue.length > 0) {
                field.onBlur(); // Trigger the onBlur method from the Controller
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
          {required ? `This field is required.` : ""}
        </p>
      ) : null}
    </div>
  );
}
