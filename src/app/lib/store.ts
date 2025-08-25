import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "./features/chats/chatsSlice";

export const store = () =>
  configureStore({
    reducer: {
      chats: chatsReducer,
    },
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
