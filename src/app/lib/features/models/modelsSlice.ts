import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AiModel {
  name: string;
  isSelected: boolean;
}

const initialState: AiModel[] = [
  { name: "gemma:2b", isSelected: true },
  { name: "gemma:3b", isSelected: false },
];
export type SelectModelPayload = Pick<AiModel, "name">;

export const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    selectModel: (state, action: PayloadAction<SelectModelPayload>) => {
      state.forEach((model) => {
        model.isSelected = model.name === action.payload.name;
      });
    },
  },
});

export const { selectModel } = modelsSlice.actions;
export default modelsSlice.reducer;
