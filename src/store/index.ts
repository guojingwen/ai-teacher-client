import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import inputReducer from './inputSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    input: inputReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
