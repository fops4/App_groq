import { useState, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { api } from '../services/api'

export function useChat(userId) {
  const { 
    messages, addMessage, setMessages, model, 
    conversations, setConversations,
    currentConversationId, setCurrentConversationId 
  } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)

  // Load history on mount
  useEffect(() => {
    if (userId) {
      api.getHistory(userId).then(setConversations)
    }
  }, [userId])

  const selectConversation = (id) => {
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      setMessages(conv.messages)
      setCurrentConversationId(id)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentConversationId(null)
  }

  const sendMessage = async (content) => {
    const userMsg = { role: 'user', content }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    let currentAssistantContent = ""
    
    try {
      await api.chatCompletions({
        model,
        messages: updatedMessages,
        stream: true,
        user_id: userId,
        conversation_id: currentConversationId
      }, (chunk) => {
        const delta = chunk.choices[0]?.delta?.content || ""
        currentAssistantContent += delta
      })
      
      const assistantMsg = { role: 'assistant', content: currentAssistantContent }
      addMessage(assistantMsg)
      
      // Refresh history to get new titles/conversations
      api.getHistory(userId).then(setConversations)
    } catch (e) {
      console.error(e)
      addMessage({ role: 'assistant', content: "Erreur de communication." })
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, sendMessage, isLoading, conversations, selectConversation, currentConversationId, startNewChat }
}
