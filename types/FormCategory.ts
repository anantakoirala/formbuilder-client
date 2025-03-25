export type FormCategory = "Layout" | "Field";

export type FormBlockType =
  | "RowLayout"
  | "RadioSelect"
  | "TextField"
  | "TextArea"
  | "StarRating"
  | "Heading"
  | "Paragraph"
  | "Select"
  | "MultipleChoice"
  | "Fileupload";

export type ObjectBlockType = {
  blockCategory: FormCategory;
  blockType: FormBlockType;
  createInstance: (id: string) => FormBlockInstance;
  blockBtnElement: {
    icon: React.ElementType;
    label: string;
  };
  canvasComponent: React.FC<{ blockInstance: FormBlockInstance }>;
  formComponent: React.FC<{ blockInstance: FormBlockInstance }>;
  propertiesComponent: React.FC<{
    blockInstance: FormBlockInstance;
    positionIndex?: number;
    parentId?: string;
  }>;
  publicFormComponent: React.FC<{
    blockInstance: FormBlockInstance;
    register: any;
    errors: any;
    trigger: any;
    control: any;
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
