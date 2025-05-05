import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { ChevronDown, GripVertical, StarIcon } from "lucide-react";
import { z } from "zod";
import { Label } from "../ui/label";
import { Rating } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";
import { defaultPrimaryColor } from "@/constants";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updateChildBlock } from "@/redux/form/formSlice";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { RootState } from "@/redux/store";

const blockCategory: FormCategory = "Field";
const blockType: FormBlockType = "StarRating";

type AttributeType = {
  label: string;
  helperText: string;
  required: boolean;
  maxStars: number;
};

const propertiesValidateSchema = z.object({
  label: z.string().trim().min(2).max(255),
  maxStars: z.number().min(1),
  required: z.boolean().default(false),
});

const StarDrawing = (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M24 9.30056C24 9.57278 23.8125 9.82987 23.625 10.0265L18.3894 15.38L19.6298 22.9414C19.6443 23.0472 19.6443 23.1379 19.6443 23.2438C19.6443 23.6371 19.4712 24 19.0528 24C18.8509 24 18.649 23.9243 18.476 23.8186L12 20.2496L5.52403 23.8186C5.33653 23.9243 5.14903 24 4.94712 24C4.52884 24 4.34134 23.6371 4.34134 23.2438C4.34134 23.1379 4.35577 23.0472 4.37019 22.9414L5.61057 15.38L0.360577 10.0265C0.1875 9.82987 0 9.57278 0 9.30056C0 8.84688 0.447116 8.66541 0.807693 8.60491L8.04809 7.50094L11.2933 0.620038C11.4231 0.332702 11.6683 0 12 0C12.3317 0 12.5769 0.332702 12.7067 0.620038L15.9519 7.50094L23.1923 8.60491C23.5385 8.66541 24 8.84688 24 9.30056Z"
    fill=""
  />
);

export const StarRatingBlock: ObjectBlockType = {
  blockType,
  blockCategory, // Specify the category (e.g., "Input" or "Feedback")
  createInstance: (id: string, parentId?: string) => ({
    id,
    blockType: "StarRating",
    parentId,
    attributes: {
      label: "Star Rating",
      helperText: "",
      maxStars: 5, // Default to 5 stars
      required: true,
    },
  }),
  blockBtnElement: {
    icon: StarIcon, // Replace with your star icon
    label: "Star Rating",
  },
  canvasComponent: StarRatingCanvasComponent,
  formComponent: StarRatingFormComponent,
  propertiesComponent: StarRatingPropertiesComponent,
  publicFormComponent: StarRatingPublicFormComponent,
  dragOverLayComponent: DragOverLayComponent,
};

function DragOverLayComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as any;
  const { label, required, maxStars, helperText } = block.attributes;
  return (
    <div
      className={`inline-block whitespace-nowrap px-2 py-1 rounded bg-white shadow text-left }`}
    >
      {label}
    </div>
  );
}

type NewStarRatingBlockInstance = FormBlockInstance & {
  attributes: AttributeType;
};

function StarRatingCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as any;
  const { childBlockDisabled, form } = useSelector(
    (state: RootState) => state.form
  );
  const { label, required, maxStars, helperText } = block.attributes;

  const draggable = useDraggable({
    id: `${block.parentId}-rating-${block.id}`,
    disabled: form.published,
    data: {
      blockType: block.blockType,
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
    },
  });

  const topCorner = useDroppable({
    id: `${block.parentId}-rating-${block.id}-above`,
    disabled: childBlockDisabled || form.published,
    data: {
      isRowLayoutChildItem: true,
      blockId: block.id,
      parentId: block.parentId,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: `${block.parentId}-rating-${block.id}-below`,
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

        <Label className="text-base !font-normal mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="flex items-center gap-10 justify-center">
          <Rating
            style={{ maxWidth: 420 }}
            value={0}
            items={maxStars}
            radius="large"
            spaceBetween="large"
            readOnly={true}
            className="!fill-primary"
            itemStyles={{
              itemShapes: StarDrawing,
              activeFillColor: defaultPrimaryColor,
              inactiveFillColor: "#fff",
              activeStrokeColor: defaultPrimaryColor,
              inactiveStrokeColor: defaultPrimaryColor,
              itemStrokeWidth: 1,
            }}
          />
        </div>

        {helperText && (
          <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
        )}
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
function StarRatingFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as any;
  const { label, required, maxStars, helperText } = block.attributes;

  const [rating, setRating] = useState(0);
  const [isError, setIsError] = useState(false);

  const handleStarChange = (newRating: number) => {
    setRating(newRating);
    const isValid = validateField(newRating);
    setIsError(!isValid);
  };

  // Function to validate the field
  const validateField = (newRating: number) => {
    if (required) {
      return newRating > 0;
    }
    return true;
  };
  return (
    <div className="flex flex-col gap-2 w-full mb-1">
      <Label
        className={`text-base !font-normal mb-1 ${
          isError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-10 justify-center">
        {/* Render stars */}
        <Rating
          style={{ maxWidth: 420 }}
          value={rating}
          onChange={handleStarChange} // Update the rating when a star is selected
          items={maxStars}
          readOnly={false}
          className="!fill-primary"
          radius="large"
          spaceBetween="large"
          itemStyles={{
            itemShapes: StarDrawing,
            activeFillColor: defaultPrimaryColor,
            inactiveFillColor: "#fff",
            activeStrokeColor: defaultPrimaryColor,
            inactiveStrokeColor: isError ? "#ef4444" : defaultPrimaryColor,
            itemStrokeWidth: 1,
          }}
        />
      </div>
      {isError ? (
        <p className="text-red-500 text-[0.8rem]">
          {required && rating === 0 ? "This field is required." : ""}
        </p>
      ) : null}

      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}
function StarRatingPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewStarRatingBlockInstance;
  const dispatch = useDispatch();
  // Initialize the form with validation and default values
  const form = useForm<z.infer<typeof propertiesValidateSchema>>({
    resolver: zodResolver(propertiesValidateSchema),
    defaultValues: {
      label: block.attributes.label,
      required: block.attributes.required,
      maxStars: Number(block.attributes.maxStars) || 5,
    },
    mode: "onBlur",
  });

  const { reset, register } = form;

  // Reset form values when block attributes change
  useEffect(() => {
    reset({
      label: block.attributes.label,
      required: block.attributes.required,
      maxStars: Number(block.attributes.maxStars) || 5,
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
          Rating {positionIndex}
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

function StarRatingPublicFormComponent({
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
  const block = blockInstance as any;
  const { label, required, maxStars, helperText } = block.attributes;

  const fieldName = `${blockInstance.id}`;

  return (
    <div className="flex flex-col gap-2 w-full mb-1">
      <Label
        className={`text-base !font-normal mb-1 ${
          errors?.[fieldName] ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Controller
        name={fieldName}
        control={control}
        defaultValue={0} // Ensure controlled state
        rules={{
          required: required ? "This field is required." : false,
          validate: (value) => value > 0 || "Please select at least one star.",
        }}
        render={({ field }) => (
          <div className="flex items-center gap-10 justify-center">
            <Rating
              style={{ maxWidth: 420 }}
              value={field.value}
              onChange={(newRating: any) => field.onChange(newRating)} // Update form state
              items={maxStars}
              readOnly={false}
              className="!fill-primary"
              radius="large"
              spaceBetween="large"
              itemStyles={{
                itemShapes: StarDrawing,
                activeFillColor: defaultPrimaryColor,
                inactiveFillColor: "#fff",
                activeStrokeColor: defaultPrimaryColor,
                inactiveStrokeColor: errors?.[fieldName]
                  ? "#ef4444"
                  : defaultPrimaryColor,
                itemStrokeWidth: 1,
              }}
            />
          </div>
        )}
      />

      {errors?.[fieldName] && (
        <p className="text-red-500 text-[0.8rem]">
          {errors[fieldName]?.message}
        </p>
      )}

      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}
