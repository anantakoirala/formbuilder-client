import { Form } from "@/types/Form";
import { FormBlockInstance } from "@/types/FormCategory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";

type initialState = {
  isSheetOpen: boolean;
  background: string;
};

const initialState: initialState = {
  isSheetOpen: false,
  background: "",
};

export const formSettingSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    openSheet: (state) => {
      state.isSheetOpen = true;
    },
    closeSheet: (state) => {
      state.isSheetOpen = false;
    },
    toggleSheet: (state) => {
      state.isSheetOpen = !state.isSheetOpen;
    },
  },
});

export const { openSheet, closeSheet, toggleSheet } = formSettingSlice.actions;
export default formSettingSlice.reducer;
