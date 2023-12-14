import { RootState } from '.';
import { createSlice } from '@reduxjs/toolkit';

export interface KeyboardState {
  isVoice: boolean;
  msgType: 'done' | 'requesting' | 'responding' | 'error';
}
const defaultData = {
  isVoice: false,
  msgType: 'done',
};

const inputSlice = createSlice({
  name: 'input',
  initialState: {
    value: defaultData,
  },
  reducers: {
    switchInput: (state) => {
      const { isVoice } = state.value;
      state.value.isVoice = !isVoice;
    },
  },
});
export default inputSlice.reducer;

export const getInputState = (state: RootState) => state.input.value;

export const { switchInput } = inputSlice.actions;
