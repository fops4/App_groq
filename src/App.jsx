import React, { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import { LogOut, Bot, Plus, MessageSquare, Menu, X, User, Settings } from 'lucide-react'

function App() {
  const { user, login, logout } = useAuth()
  const { 
    conversations, selectConversation, currentConversationId, startNewChat 
  } = useChat(user?.id)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  if (!user) {
    return (
      <div className="login-container">
        <div className="auth-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
             <div style={{ background: '#0f172a', padding: '14px', borderRadius: '16px' }}>
                <Bot color="white" size={36} />
             </div>
          </div>
          <h1>Bienvenue</h1>
          <p>Connectez-vous pour continuer</p>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); login(username, password) }}>
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn-submit" type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">Groq.</div>
        <button className="new-chat-btn" onClick={() => { startNewChat(); setSidebarOpen(false); }}>
          <Plus size={20} /> Nouveau Chat
        </button>
        <div className="history-list">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`history-item ${currentConversationId === conv.id ? 'active' : ''}`}
              onClick={() => { selectConversation(conv.id); setSidebarOpen(false); }}
            >
              <MessageSquare size={16} />
              <span>{conv.title}</span>
            </div>
          ))}
        </div>
        
        <div className="sidebar-profile">
          {showProfileMenu && (
            <div className="profile-menu">
              <button onClick={logout} className="profile-menu-item logout">
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
          <button className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="avatar">
              <User size={18} />
            </div>
            <span className="username">{user.username}</span>
            <Settings size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="header-title">
            {currentConversationId ? 'Discussion active' : 'Nouvelle session'}
          </div>
        </header>
        
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
        
        <main>
          <ChatWindow userId={user.id} />
        </main>
      </div>
    </div>
  )
}

export default App
