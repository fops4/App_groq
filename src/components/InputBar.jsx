import React, { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import ModelSelector from './ModelSelector'

function InputBar({ onSend, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className="input-wrapper-saas">
      <div className="input-header-saas">
        <ModelSelector />
      </div>
      <form className="input-bar-saas" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Comment puis-je vous aider ?" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          disabled={disabled}
        />
        <button className="send-btn-saas" type="submit" disabled={disabled || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
      <div className="input-footer-saas">
        L'IA peut faire des erreurs. Envisagez de vérifier les informations importantes.
      </div>
    </div>
  )
}

export default InputBar
