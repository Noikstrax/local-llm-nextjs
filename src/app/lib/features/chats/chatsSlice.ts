import { Message } from "@/app/components/chatbox/MessageList";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Chat {
  chatId: string;
  messages: Message[];
}

const initialState: Chat[] = [
  {
    chatId: "1",
    messages: [
      { id: 1, text: "Okay man it`s alright", owner: "user" },
      {
        id: 2,
        text: "Hahahahah",
        owner: "ai",
      },
    ],
  },
];

export type MessagePayload = Message & {
  chatId: string;
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      state.map((chat) => {
        chat.chatId === action.payload.chatId
          ? chat.messages.push(action.payload)
          : chat;
      });
    },
    createChat: (state, action: PayloadAction<string>) => {
      state.push({
        chatId: action.payload,
        messages: [],
      });
    },
  },
});

export const { addMessage, createChat } = chatsSlice.actions;
export default chatsSlice.reducer;
