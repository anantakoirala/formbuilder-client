import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { generateUniqueId } from "@/lib/generateUniqueId";
import { cn } from "@/lib/utils";
import {
  duplicateBlockLayout,
  removeBlockLayout,
  setBlocks,
  setSelectedBlockLayoutId,
} from "@/redux/form/formSlice";
import { RootState } from "@/redux/store";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { useDraggable } from "@dnd-kit/core";
import { Copy, GripHorizontal, Rows2, TrashIcon } from "lucide-react";
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
};

function RowLayoutCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const childBlocks = blockInstance.childBlocks || [];
  const dispatch = useDispatch();
  const { blockLayouts, selectedBlockLayoutId } = useSelector(
    (state: RootState) => state.form
  );

  // Remve block from block layouts
  const remove_block_Layout = (id: string) => {
    dispatch(removeBlockLayout(id));
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
          <div className="flex flex-wrap gap-2">
            {childBlocks?.length == 0 ? (
              <PlaceHolder />
            ) : (
              <div className="flex flex-col items-center justify-start w-full  gap-4 py-4 px-3">
                <div className="flex items-center justify-center gap-1">
                  {/* Child block */}
                </div>
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

function RowLayoutFormComponent() {
  return <div>Form comp</div>;
}

function RowLayoutPropertiesComponent() {
  return <div>Properties comp</div>;
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
