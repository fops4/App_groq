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
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default open on desktop
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // On mobile, close sidebar by default
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }, [])

  if (!user) {
    return (
      <div className="login-container">
        <div className="auth-card">
          <div className="auth-logo-box">
             <Bot color="white" size={32} />
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
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '0.5rem' }}>
          <div className="sidebar-logo">Groq.</div>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(false)} style={{ color: 'white', opacity: 0.5 }}>
            <X size={20} />
          </button>
        </div>
        
        <button className="new-chat-btn" onClick={() => { startNewChat(); if(window.innerWidth <= 768) setSidebarOpen(false); }}>
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
            <span className="username" style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</span>
            <Settings size={16} style={{ opacity: 0.5 }} />
          </button>
        </div>
      </aside>

      {/* Overlay visible only on mobile when sidebar is open */}
      <div className={`overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <div className="main-content">
        <header>
          <div className="header-left">
            <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="header-title">
              {currentConversationId ? 'Chat' : 'Nouveau Chat'}
            </div>
          </div>
          <div className="header-right">
             {/* Small logo for mobile */}
             <div style={{ fontWeight: 800, opacity: 0.2 }}>Groq.</div>
          </div>
        </header>
        
        <main>
          <ChatWindow userId={user.id} />
        </main>
      </div>
    </div>
  )
}

export default App
