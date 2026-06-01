import React, { useState } from 'react'
import { useChatStore } from '../store/chatStore'
import { ChevronDown } from 'lucide-react'

function ModelSelector() {
  const { model, setModel } = useChatStore()
  
  const models = [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 (High)" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 (Fast)" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7b" },
    { id: "gemma2-9b-it", name: "Gemma 2" }
  ]

  return (
    <div className="model-selector-inline">
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        {models.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <ChevronDown size={14} className="selector-icon" />
    </div>
  )
}

export default ModelSelector
