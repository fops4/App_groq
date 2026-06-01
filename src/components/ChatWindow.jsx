import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import { useChat } from '../hooks/useChat'

function ChatWindow({ userId }) {
  const { messages, sendMessage, isLoading } = useChat(userId)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Comment puis-je vous aider aujourd'hui ?</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && (
          <div className="message-wrapper assistant-wrapper">
             <div className="message-bubble assistant">
                <div className="dot-pulse"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <InputBar onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}

export default ChatWindow
