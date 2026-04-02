// src/routes/AppRoutes.tsx

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from '../components/layout/PrivateRoute'

// Auth Pages
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'

// Main Pages
import { Dashboard } from '../pages/dashboard/Dashboard'
import { DietPage } from '../pages/diet/DietPage'
import { WorkoutPage } from '../pages/workout/WorkoutPage'
import { ProfilePage } from '../pages/profile/ProfilePage'

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/diet"
          element={
            <PrivateRoute>
              <DietPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <PrivateRoute>
              <WorkoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
