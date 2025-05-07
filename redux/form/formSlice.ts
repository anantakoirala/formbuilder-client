import { Form } from "@/types/Form";
import { FormBlockInstance } from "@/types/FormCategory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialState = {
  form: Form;
  blockLayouts: FormBlockInstance[];
  selectedBlockLayoutId: string | null;
  childBlockDisabled: boolean;
};

const initialState: initialState = {
  form: {
    id: 0,
    userId: 0,
    name: "",
    description: "",
    jsonBlocks: {},
    views: 0,
    responses: 0,
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    responseCount: 0,
  },
  blockLayouts: [],
  selectedBlockLayoutId: null,
  childBlockDisabled: true,
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setForm: (state, action) => {
      state.form = action.payload;
    },
    setBlocks: (state, action) => {
      state.blockLayouts.push(action.payload);
    },
    removeBlockLayout: (state, action) => {
      state.blockLayouts = state.blockLayouts.filter(
        (layout) => layout.id !== action.payload
      );
    },
    removeSelectedBlockLayoutId: (state, action) => {
      state.selectedBlockLayoutId = action.payload;
    },
    duplicateBlockLayout: (
      state,
      action: PayloadAction<{
        insertIndex: number;
        newBlock: FormBlockInstance;
      }>
    ) => {
      const { insertIndex, newBlock } = action.payload;
      state.blockLayouts.splice(insertIndex, 0, newBlock);
    },

    setSelectedBlockLayoutId: (
      state,
      action: PayloadAction<{ id: string | null }>
    ) => {
      const { id } = action.payload;
      state.selectedBlockLayoutId = id;
    },
    setRepositionBlockLayout: (
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        position: "above" | "below";
      }>
    ) => {
      const { activeId, overId, position } = action.payload;

      // Find indices of active and over blocks
      const activeIndex = state.blockLayouts.findIndex(
        (layout) => layout.id === activeId
      );
      const overIndex = state.blockLayouts.findIndex(
        (layout) => layout.id === overId
      );

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return;
      }

      // Remove the active block from its current position
      const [movedBlock] = state.blockLayouts.splice(activeIndex, 1);
      const insertIndex = position === "above" ? overIndex : overIndex + 1;

      // Insert the block at the new position
      state.blockLayouts.splice(insertIndex, 0, movedBlock);
    },

    setChildBlockDisabled: (state, action) => {
      state.childBlockDisabled = action.payload;
    },

    insertBlockInSpecificPosition: (
      state,
      action: PayloadAction<{
        overId: string;
        newBlockLayout: FormBlockInstance;
        position: "above" | "below";
      }>
    ) => {
      const { overId, newBlockLayout, position } = action.payload;
      // Find the index of the block over which we want to insert
      const overIndex = state.blockLayouts.findIndex(
        (block) => block.id === overId
      );

      if (overIndex === -1) {
        return;
      }
      const insertIndex = position === "above" ? overIndex : overIndex + 1;

      // Insert the new block at the calculated index
      state.blockLayouts.splice(insertIndex, 0, newBlockLayout);
    },
    updateBlockLayout: (
      state,
      action: PayloadAction<{
        id: string;
        updatedChildBlocks: FormBlockInstance[];
      }>
    ) => {
      const { id, updatedChildBlocks } = action.payload;

      // Update the blockLayouts
      state.blockLayouts = state.blockLayouts.map((block) =>
        block.id === id ? { ...block, childBlocks: updatedChildBlocks } : block
      );
    },

    updateChildBlock: (
      state,
      action: PayloadAction<{
        parentId: string;
        childBlockId: string;
        updateChildBlock: FormBlockInstance;
      }>
    ) => {
      const { parentId, childBlockId, updateChildBlock } = action.payload;

      // Find the parent block
      const parentBlock = state.blockLayouts.find(
        (block) => block.id === parentId
      );
      if (!parentBlock || !parentBlock.childBlocks) return;

      // Find the specific child block and update it directly
      const childBlockIndex = parentBlock.childBlocks.findIndex(
        (child) => child.id === childBlockId
      );

      if (childBlockIndex !== -1) {
        Object.assign(
          parentBlock.childBlocks[childBlockIndex],
          updateChildBlock
        );
      }
    },
    repositionChildBlock: (
      state,
      action: PayloadAction<{
        overParentId: string;
        overChildId: string;
        activeParentId: string;
        activeChildId: string;
        position: "above" | "below";
      }>
    ) => {
      const {
        overChildId,
        overParentId,
        activeChildId,
        activeParentId,
        position,
      } = action.payload;

      if (
        overParentId === undefined ||
        overChildId === undefined ||
        activeChildId === undefined ||
        position === undefined
      ) {
        return;
      }
      const activeParentLayout = state.blockLayouts.find(
        (block) => block.id === activeParentId
      );
      if (!activeParentLayout || !activeParentLayout.childBlocks) return;

      const childTobeMoved = activeParentLayout.childBlocks.find(
        (child) => child.id === activeChildId
      );
      if (!childTobeMoved) return;
      childTobeMoved.parentId = overParentId;
      activeParentLayout.childBlocks = activeParentLayout.childBlocks.filter(
        (child) => child.id !== activeChildId
      );

      // Step 2: Find the target (over) layout and insert at correct position
      const overParentLayout = state.blockLayouts.find(
        (block) => block.id === overParentId
      );
      if (!overParentLayout || !overParentLayout.childBlocks) return;

      const overIndex = overParentLayout.childBlocks.findIndex(
        (child) => child.id === overChildId
      );
      if (overIndex === -1) return;

      const insertIndex = position === "above" ? overIndex : overIndex + 1;

      // Insert the moved child into new position
      overParentLayout.childBlocks.splice(insertIndex, 0, childTobeMoved);
    },
    insertNewBlockAccordingToChildPosition: (
      state,
      action: PayloadAction<{
        overParentId: string;
        overChildId: string;
        newBlockLayout: FormBlockInstance;
        position: "below" | "above";
      }>
    ) => {
      const { overParentId, overChildId, newBlockLayout, position } =
        action.payload;

      const parentBlock = state.blockLayouts.find(
        (block) => block.id === overParentId
      );
      if (!parentBlock) return;

      if (parentBlock.childBlocks) {
        const overIndex = parentBlock.childBlocks.findIndex(
          (child) => child.id === overChildId
        );
        if (overIndex === -1) return;

        const insertIndex = position === "above" ? overIndex : overIndex + 1;

        // Insert the moved child into new position
        parentBlock.childBlocks.splice(insertIndex, 0, newBlockLayout);
      } else {
        parentBlock.childBlocks = [newBlockLayout];
      }
    },
    insertChildElementToNewRowLayout: (
      state,
      action: PayloadAction<{
        rowLayoutId: string;
        childParentId: string;
        childId: string;
      }>
    ) => {
      const { childId, childParentId, rowLayoutId } = action.payload;
      if (
        childId === undefined ||
        childParentId === undefined ||
        rowLayoutId === undefined
      ) {
        return;
      }

      const appendableRowLayout = state.blockLayouts.find(
        (layout) => layout.id === rowLayoutId
      );
      if (!appendableRowLayout) {
        return;
      }

      const activeParentLayout = state.blockLayouts.find(
        (block) => block.id === childParentId
      );
      if (!activeParentLayout || !activeParentLayout.childBlocks) return;

      const childTobeMoved = activeParentLayout.childBlocks.find(
        (child) => child.id === childId
      );
      if (!childTobeMoved) return;

      childTobeMoved.parentId = rowLayoutId;
      activeParentLayout.childBlocks = activeParentLayout.childBlocks.filter(
        (child) => child.id !== childId
      );

      if (!appendableRowLayout.childBlocks) {
        appendableRowLayout.childBlocks = [childTobeMoved];
      } else {
        appendableRowLayout.childBlocks.push(childTobeMoved); // <- this was missing
      }
    },

    setName: (state, action) => {
      state.form.name = action.payload;
    },
    resetFormState: () => initialState,
  },
});

export const {
  setForm,
  setBlocks,
  removeBlockLayout,
  duplicateBlockLayout,
  setSelectedBlockLayoutId,
  setRepositionBlockLayout,
  insertBlockInSpecificPosition,
  updateBlockLayout,
  updateChildBlock,
  repositionChildBlock,
  setChildBlockDisabled,
  insertNewBlockAccordingToChildPosition,
  insertChildElementToNewRowLayout,
  resetFormState,
  setName,
  removeSelectedBlockLayoutId,
} = formSlice.actions;
export default formSlice.reducer;
