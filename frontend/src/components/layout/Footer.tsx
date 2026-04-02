// src/components/layout/Footer.tsx

import React from 'react'
import './Footer.css'

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>FitPlan</h3>
          <p>Sistema completo de planejamento de treinos e alimentação</p>
        </div>

        <div className="footer-section">
          <h4>Navegação</h4>
          <ul>
            <li>
              <a href="#/">Home</a>
            </li>
            <li>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#/diet">Dieta</a>
            </li>
            <li>
              <a href="#/workout">Treino</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contato</h4>
          <ul>
            <li>Email: contato@fitplan.com</li>
            <li>Telefone: (11) 9999-9999</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 FitPlan. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
