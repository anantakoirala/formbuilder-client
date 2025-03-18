import { RowLayoutBlock } from "@/components/blocks/layouts/RowLayout";
import { RadioSelectBlock } from "@/components/blocks/RadioSelectBlock";
import { TextAreaBlock } from "@/components/blocks/TextAreaBlock";
import { TextFieldBlock } from "@/components/blocks/TextFieldBlock";
import { FormBlocksType } from "@/types/FormCategory";

export const FormBlocks: FormBlocksType = {
  RowLayout: RowLayoutBlock,
  TextField: TextFieldBlock,
  RadioSelect: RadioSelectBlock,
  TextArea: TextAreaBlock,
};
