import { SelectFieldBlock } from "@/components/blocks/DropDownBLock";
import { HeadingBlock } from "@/components/blocks/HeadingBlock";
import { RowLayoutBlock } from "@/components/blocks/layouts/RowLayout";
import { MultipleChoiceBlock } from "@/components/blocks/MultipleChoiceBlock";
import { ParagraphBlock } from "@/components/blocks/ParagraphBlock";
import { RadioSelectBlock } from "@/components/blocks/RadioSelectBlock";
import { StarRatingBlock } from "@/components/blocks/StarRatingBlock";
import { TextAreaBlock } from "@/components/blocks/TextAreaBlock";
import { TextFieldBlock } from "@/components/blocks/TextFieldBlock";
import { FormBlocksType } from "@/types/FormCategory";

export const FormBlocks: FormBlocksType = {
  RowLayout: RowLayoutBlock,
  TextField: TextFieldBlock,
  RadioSelect: RadioSelectBlock,
  TextArea: TextAreaBlock,
  StarRating: StarRatingBlock,
  Heading: HeadingBlock,
  Paragraph: ParagraphBlock,
  Select: SelectFieldBlock,
  MultipleChoice: MultipleChoiceBlock,
};
