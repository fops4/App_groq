import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('chat_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (username, password) => {
    try {
      const data = await api.login(username, password)
      setUser(data)
      localStorage.setItem('chat_user', JSON.stringify(data))
    } catch (e) {
      alert("Identifiants incorrects")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('chat_user')
  }

  return { user, login, logout }
}
