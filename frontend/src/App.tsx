// src/App.tsx

import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { AppRoutes } from './routes/AppRoutes'
import './styles/global.css'
import './styles/variables.css'

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppRoutes />
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
