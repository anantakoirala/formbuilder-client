import { Form } from "@/types/Form";
import { FormBlockInstance } from "@/types/FormCategory";
import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  form: Form;
  blockLayouts: FormBlockInstance[];
};

const initialState: initialState = {
  form: {
    id: 0, // Default ID, assuming 0 means "not set"
    userId: 0, // Default user ID
    name: "", // Empty string for form name
    description: "", // Optional, default to empty string
    jsonBlocks: {}, // Assuming it should be an empty object
    view: 0, // Default views to 0
    responses: 0, // Default responses to 0
    published: false, // Default as not published
    createdAt: new Date(), // Default to current date
    updatedAt: new Date(), // Default to current date
  },
  blockLayouts: [],
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setForm: (state, action) => {
      console.log("action", action);
      state.form = action.payload;
    },
    setBlocks: (state, action) => {
      state.blockLayouts.push(action.payload);
    },
  },
});

export const { setForm, setBlocks } = formSlice.actions;
export default formSlice.reducer;
