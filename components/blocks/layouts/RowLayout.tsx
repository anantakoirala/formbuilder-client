import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategory,
  ObjectBlockType,
} from "@/types/FormCategory";
import { Copy, GripHorizontal, Rows2, TrashIcon } from "lucide-react";

const blockCategory: FormCategory = "Layout";
const blockType: FormBlockType = "RowLayout";

export const RowLayoutBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  createInstance: (id: string) => ({
    id: `row-layout-${id}`,
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
  return (
    <div className="max-w-full ">
      {blockInstance.isLocked && <Border />}

      <Card
        className={cn(
          `w-full bg-white relative border shadow-sm min-h-[120px] max-w-[768px] rounded-md p-0 `,
          blockInstance.isLocked && "rounded-t-none"
        )}
      >
        <CardContent className="px-2 pb-2">
          {!blockInstance.isLocked && (
            <div
              className="flex items-center w-full  h-[2px] cursor-move justify-center"
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
        {!blockInstance.isLocked && (
          <CardFooter className="flex items-center gap-3  justify-end border-t py-3">
            <Button variant={"outline"} size={"icon"}>
              <Copy />
            </Button>
            <Button variant={"outline"} size={"icon"}>
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
