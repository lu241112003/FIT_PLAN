// src/components/layout/Sidebar.tsx

import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Menu Principal</h3>
          <ul className="sidebar-links">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/diet">Planos Alimentares</Link>
            </li>
            <li>
              <Link to="/workout">Planos de Treino</Link>
            </li>
            <li>
              <Link to="/profile">Meu Perfil</Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Ferramentas</h3>
          <ul className="sidebar-links">
            <li>
              <Link to="/diet/meals">Minhas Refeições</Link>
            </li>
            <li>
              <Link to="/workout/history">Histórico de Treinos</Link>
            </li>
            <li>
              <Link to="/progress">Progresso</Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}
