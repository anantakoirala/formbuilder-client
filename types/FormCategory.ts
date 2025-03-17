export type FormCategory = "Layout" | "Field";

export type FormBlockType = "RowLayout" | "RadioSelect";

export type ObjectBlockType = {
  blockCategory: FormCategory;
  blockType: FormBlockType;
  createInstance: (id: string) => FormBlockInstance;
  blockBtnElement: {
    icon: React.ElementType;
    label: string;
  };
  canvasComponent: React.FC<{ blockInstance: FormBlockInstance }>;
  formComponent: React.FC;
  propertiesComponent: React.FC<{
    blockInstance: FormBlockInstance;
    positionIndex?: number;
    parentId?: string;
  }>;
};

export type FormBlockInstance = {
  id: string;
  blockType: FormBlockType;
  attributes?: Record<string, any>;
  childBlocks?: FormBlockInstance[];
  isLocked?: boolean;
};

export type FormBlocksType = {
  [key in FormBlockType]: ObjectBlockType;
};
