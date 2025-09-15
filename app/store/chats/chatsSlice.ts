import { Message } from "../../../src/pages/chat/ui/chat-box/MessageList";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

function cleanResponse(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export interface ChatsState {
  isLoading: "pending" | "succeeded" | "failed";
  chats: Chat[];
}

export interface Chat {
  chatId: string;
  title: string;
  messages: Message[];
}

export const fetchChats = createAsyncThunk<Chat[]>(
  "chats/fetchChats",
  async () => {
    const res = await fetch("/api/chats");
    if (!res.ok) throw new Error("Error chats loading");
    const data: Chat[] = await res.json();
    return data;
  }
);

const initialStateChats: Chat[] = [
  {
    chatId: "1",
    title: "User question",
    messages: [
      { id: 1, text: "User question", owner: "user", loading: "succeeded" },
      {
        id: 2,
        text: "Ai answer",
        owner: "ai",
        loading: "succeeded",
      },
    ],
  },
  {
    chatId: "2",
    title: "User question 2",
    messages: [
      { id: 1, text: "User question 2", owner: "user", loading: "succeeded" },
      {
        id: 2,
        text: "Ai answer 2",
        owner: "ai",
        loading: "succeeded",
      },
      {
        id: 3,
        text: "Hello!",
        owner: "user",
        loading: "succeeded",
      },
      {
        id: 4,
        text: "Hello! How can I assist you today? 😊",
        owner: "ai",
        loading: "succeeded",
      },
      {
        id: 5,
        text: "Hello! How can I assist you today? 😊",
        owner: "user",
        loading: "succeeded",
      },
      {
        id: 6,
        text: `Certainly! Here's an organized and elegant introduction based on your thoughts: --- 
        **Introduction** Mathematics is more than just a set of equations; it’s a language that helps us 
        understand patterns, relationships, and the structure of the universe. From the intricate designs in art 
        to the principles governing physics, math plays a crucial role in explaining and predicting phenomena across 
        various disciplines. This paper explores how mathematics is both an indispensable tool for solving real-world 
        problems and a universal framework for exploring fundamental questions about existence and reality. 
        The importance of mathematics extends beyond textbooks; it’s embedded in technologies like smartphones, computers, 
        and GPS systems that transform our lives. By analyzing these applications, we gain insights into the elegance and power 
        of mathematical concepts, which can be applied to everyday situations such as budgeting, scheduling, or even personal 
        decision-making. This introduction sets the stage by highlighting the significance of mathematics across different 
        fields and everyday life, while hinting at how its principles may evolve with new technologies. It invites readers 
        to explore the profound impact that math has on our world, encouraging a deeper appreciation for both its intrinsic 
        beauty and practical applications. --- This structure ensures a clear focus, connects math to broader themes, and engages 
        the reader with both specific examples and future implications.`,
        owner: "ai",
        loading: "succeeded",
      },
    ],
  },
];

const initialState: ChatsState = {
  isLoading: "pending",
  chats: initialStateChats,
};

export type MessagePayload = Message & {
  chatId: string;
};

export const asyncCreateChat = createAsyncThunk<Chat, string>(
  "chats/asyncCreateChat",
  async (chatId) => {
    const req = await fetch("/api/chat/createChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    });

    const res = await req.json();

    return {
      chatId: res.chatId,
      title: res.title,
      messages: [],
    };
  }
);

export const sendMessage = createAsyncThunk<
  { chatId: string; answer: string },
  { newMessage: string; model: string; chatId: string }
>(
  "chats/sendMessage",
  async (messageData: {
    newMessage: string;
    model: string;
    chatId: string;
  }) => {
    const { newMessage, model, chatId } = messageData;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: newMessage, model, chatId }),
    });

    const data = await res.json();
    return { chatId, answer: cleanResponse(data.response ?? "Error") };
  }
);

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      state.chats.map((chat) => {
        chat.chatId === action.payload.chatId
          ? chat.messages.push(action.payload)
          : chat;
      });
    },
    createChat: (state, action: PayloadAction<string>) => {
      state.chats.push({
        chatId: action.payload,
        title: `Chat:${action.payload}`,
        messages: [],
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        const { chatId } = action.meta.arg;
        const chat = state.chats.find((chat) => chat.chatId === chatId);
        if (chat) {
          const nextId = chat.messages.length + 1;
          chat.messages.push({
            id: nextId,
            text: "",
            owner: "ai",
            loading: "pending",
          });
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, answer } = action.payload;
        const chat = state.chats.find((chat) => chat.chatId === chatId);
        if (chat) {
          const aiMessage = chat.messages.find(
            (message) => message.owner === "ai" && message.loading === "pending"
          );
          if (aiMessage) {
            aiMessage.text = answer;
            aiMessage.loading = "succeeded";
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const { chatId } = action.meta.arg;
        const chat = state.chats.find((chat) => chat.chatId === chatId);
        if (chat) {
          const aiMessage = chat.messages.find(
            (message) => message.owner === "ai" && message.loading === "pending"
          );
          if (aiMessage) {
            aiMessage.text = "Ошибка при получении ответа";
            aiMessage.loading = "failed";
          }
        }
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats.push(...action.payload);
      })
      .addCase(fetchChats.rejected, (state, action) => {
        console.error("Ошибка загрузки чатов:", action.error);
      })
      .addCase(asyncCreateChat.pending, (state) => {
        state.isLoading = "pending";
      })
      .addCase(asyncCreateChat.fulfilled, (state, action) => {
        state.isLoading = "succeeded";
        state.chats.push(action.payload);
      });
  },
});

export const { addMessage, createChat } = chatsSlice.actions;
export default chatsSlice.reducer;
