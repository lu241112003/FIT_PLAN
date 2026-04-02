// src/components/layout/Header.tsx

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          FitPlan
        </Link>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <ul className="nav-links">
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/diet">Dieta</Link>
                </li>
                <li>
                  <Link to="/workout">Treino</Link>
                </li>
                <li>
                  <Link to="/profile">Perfil</Link>
                </li>
              </ul>
              <div className="header-user">
                <span className="user-name">{user?.nome}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            </>
          ) : (
            <div className="header-auth">
              <Link to="/login" className="auth-link">
                Entrar
              </Link>
              <Link to="/register" className="auth-link auth-link-register">
                Registrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
