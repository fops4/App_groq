import { create } from 'zustand'

export const useChatStore = create((set) => ({
  model: 'llama-3.3-70b-versatile',
  setModel: (model) => set({ model }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  
  currentConversationId: null,
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
}))
