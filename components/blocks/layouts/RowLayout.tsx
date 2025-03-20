import ChildBlockFormComponentWrapper from "@/components/ChildBlockFormComponentWrapper";
import ChildBlockPublicFormComponentWrapper from "@/components/ChildBlockPublicFormComponentWrapper";
import ChildCanvasComponentWrapper from "@/components/ChildCanvasComponentWrapper";
import ChildPropertiesComponentWrapper from "@/components/ChildPropertiesComponentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { allBlockLayouts } from "@/constants";
import { FormBlocks } from "@/lib/form-blocks";
import { generateUniqueId } from "@/lib/generateUniqueId";
import { cn } from "@/lib/utils";
import {
  duplicateBlockLayout,
  removeBlockLayout,
  setBlocks,
  setSelectedBlockLayoutId,
  updateBlockLayout,
} from "@/redux/form/formSlice";
import { RootState } from "@/redux/store";
import {
  FormBlockInstance,
  FormBlocksType,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import {
  Active,
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Copy, GripHorizontal, Rows2, TrashIcon, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const blockCategory: FormCategory = "Layout";
const blockType: FormBlockType = "RowLayout";

export const RowLayoutBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  createInstance: (id: string) => ({
    id: `layout-${id}`,
    blockType,
    isLocked: false,
    attributes: {},
    childBlocks: [],
  }),
  blockBtnElement: {
    icon: Rows2,
    label: "Row Layout",
  },
  canvasComponent: RowLayoutCanvasComponent,
  formComponent: RowLayoutFormComponent,
  propertiesComponent: RowLayoutPropertiesComponent,
  publicFormComponent: RootLayoutPublicFormComponent,
};

function RowLayoutCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const [activeBlock, setActiveBlock] = useState<Active | null>(null);
  const childBlocks = blockInstance.childBlocks || [];

  const dispatch = useDispatch();

  // Droppable for fields
  const droppable = useDroppable({
    id: blockInstance.id,
    disabled: blockInstance.isLocked,
    data: {
      isLayoutDropArea: true,
    },
  });

  // Monitor for fields
  useDndMonitor({
    onDragStart: (event) => {
      setActiveBlock(event.active);
    },
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !active) return;
      setActiveBlock(null);

      const isBlockBtnElement = active?.data?.current?.isBlockBtnElement;
      const isLayout = active?.data?.current?.blockType;

      const overBlockId = over?.id;

      if (
        isBlockBtnElement &&
        !allBlockLayouts.includes(isLayout) &&
        overBlockId === blockInstance.id
      ) {
        const blockType = active?.data?.current?.blockType;
        const newBlock = FormBlocks[blockType as FormBlockType].createInstance(
          generateUniqueId()
        );

        const updatedChildBlocks = [...childBlocks, newBlock];

        dispatch(
          updateBlockLayout({ id: blockInstance.id, updatedChildBlocks })
        );
      }
    },
  });
  const { blockLayouts, selectedBlockLayoutId } = useSelector(
    (state: RootState) => state.form
  );

  // Remve block from block layouts
  const remove_block_Layout = (id: string) => {
    console.log("id", id);
    dispatch(removeBlockLayout(id));
    dispatch(setSelectedBlockLayoutId({ id: null }));
  };

  // Duplicate
  const duplicate = (id: string) => {
    const foundBlock = blockLayouts.find((layout) => layout.id === id);
    if (foundBlock) {
      const uniqueId = `layout-${generateUniqueId()}`;
      const newBlock = {
        ...foundBlock,
        id: uniqueId,
        childBlocks: (foundBlock.childBlocks ?? []).map((childBlock) => ({
          ...childBlock,
          id: generateUniqueId(),
        })),
      };

      const insertIndex =
        blockLayouts.findIndex((block) => block.id === id) + 1;
      // const updatedBlocks = blockLayouts;
      // updatedBlocks.splice(insertIndex, 0, newBlock);
      dispatch(duplicateBlockLayout({ insertIndex, newBlock }));
    }
  };

  // Remove child block

  const removeChildBlock = (childBlockId: string) => {
    console.log("childBlockId", childBlockId);
    const filteredChildBlock = childBlocks.filter(
      (block) => block.id !== childBlockId
    );
    console.log("filtered blocks", filteredChildBlock);
    dispatch(
      updateBlockLayout({
        id: blockInstance.id,
        updatedChildBlocks: filteredChildBlock,
      })
    );
  };

  const setSelectedLayout = (id: string) => {
    dispatch(setSelectedBlockLayoutId({ id }));
  };

  const isSelected = selectedBlockLayoutId === blockInstance.id;

  const draggable = useDraggable({
    id: blockInstance.id + "_drag-area",
    disabled: blockInstance.isLocked,
    data: {
      blockType: blockInstance.blockType,
      blockId: blockInstance.id,
      isCanvasLayout: true,
    },
  });

  if (draggable.isDragging) return;

  return (
    <div className="max-w-full" ref={draggable.setNodeRef}>
      {blockInstance.isLocked && <Border />}

      <Card
        ref={droppable.setNodeRef}
        className={cn(
          `w-full bg-white relative border shadow-sm min-h-[120px] max-w-[768px] rounded-md p-0 `,
          blockInstance.isLocked && "rounded-t-none"
        )}
        onClick={() => setSelectedLayout(blockInstance.id)}
      >
        <CardContent className="px-2 pb-2">
          {isSelected && !blockInstance.isLocked && (
            <div className="w-[5px] absolute left-0 top-0 rounded-l-md h-full bg-primary" />
          )}
          {/* Drag Handle */}
          {!blockInstance.isLocked && (
            <div
              {...draggable.listeners}
              {...draggable.attributes}
              className="flex items-center w-full  h-[24px] cursor-move justify-center"
              role="button"
            >
              <GripHorizontal size={20} className="text-muted-foreground" />
            </div>
          )}
          <div className="w-full flex flex-wrap gap-2">
            {droppable.isOver &&
              !blockInstance.isLocked &&
              activeBlock?.data?.current?.isBlockBtnElement &&
              !allBlockLayouts.includes(
                activeBlock?.data?.current?.blockType
              ) && (
                <div className="relative border border-dotted border-primary bg-primary/10 w-full h-28">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 text-xs bg-primary text-white text-center w-28 p-1 rounded-b-full shadow-md">
                    Drag it here
                  </div>
                </div>
              )}
            {!droppable.isOver && childBlocks?.length == 0 ? (
              <PlaceHolder />
            ) : (
              <div className="flex flex-col items-center justify-start w-full  gap-4 py-4 px-3">
                {childBlocks.map((childBlock) => (
                  <div
                    className="w-full h-auto flex items-center justify-center gap-1"
                    key={childBlock.id}
                  >
                    {/* Child block */}
                    <ChildCanvasComponentWrapper blockInstance={childBlock} />
                    {isSelected && !blockInstance.isLocked && (
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeChildBlock(childBlock.id);
                        }}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        {isSelected && !blockInstance.isLocked && (
          <CardFooter className="flex items-center gap-3  justify-end border-t py-3">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
                duplicate(blockInstance.id);
              }}
            >
              <Copy />
            </Button>
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
                remove_block_Layout(blockInstance.id);
              }}
            >
              <TrashIcon />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function RowLayoutFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const childBlocks = blockInstance.childBlocks || [];
  return (
    <div className="max-w-full">
      {blockInstance.isLocked && <Border />}
      <Card
        className={cn(
          `w-full bg-white relative border shadow-sm min-h-[120px] max-w-[768px] rounded-md p-0 `,
          blockInstance.isLocked && "rounded-t-none"
        )}
      >
        <CardContent className="px-2 pb-2">
          <div className="flex flex-wrap gap-2">
            <div className="flex w-full flex-col items-center justify-center gap-4 py-4 px-3">
              {childBlocks.map((childBlock) => (
                <div
                  className="flex items-center justify-center gap-1 h-auto w-full"
                  key={childBlock.id}
                >
                  <ChildBlockFormComponentWrapper blockInstance={childBlock} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RowLayoutPropertiesComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const childBlocks = blockInstance.childBlocks || [];
  return (
    <div className="pt-3 w-full ">
      <div className="flex w-full flex-col items-center justify-start gap-0 py-0 px-0">
        {childBlocks.map((childBlock, index) => (
          <div
            className="w-full flex items-center justify-center gap-1 h-auto"
            key={childBlock.id}
          >
            <ChildPropertiesComponentWrapper
              index={index + 1}
              parentId={blockInstance.id}
              blockInstance={childBlock}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Border() {
  return <div className="w-full rounded-t-md min-h-[8px] bg-primary" />;
}

function PlaceHolder() {
  return (
    <div className="flex flex-col items-center justify-center border border-doted border-primary bg-primary/10 hover:bg-primary/5 w-full h-28 text-primary font-medium text-base gap-1">
      <p className="text-center text-primary/80">
        Drag and Drop a field here to get started
      </p>
    </div>
  );
}

function RootLayoutPublicFormComponent({
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
  const childBlocks = blockInstance.childBlocks || [];
  return (
    <div className="max-w-full">
      {blockInstance.isLocked && <Border />}
      <Card
        className={cn(
          `w-full bg-white relative border shadow-sm min-h-[120px] max-w-[768px] rounded-md p-0 `,
          blockInstance.isLocked && "rounded-t-none"
        )}
      >
        <CardContent className="px-2 pb-2">
          <div className="flex flex-wrap gap-2">
            <div className="flex w-full flex-col items-center justify-center gap-4 py-4 px-3">
              {childBlocks.map((childBlock) => (
                <div
                  className="flex items-center justify-center gap-1 h-auto w-full"
                  key={childBlock.id}
                >
                  <ChildBlockPublicFormComponentWrapper
                    blockInstance={childBlock}
                    register={register}
                    errors={errors}
                    trigger={trigger}
                    control={control}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
