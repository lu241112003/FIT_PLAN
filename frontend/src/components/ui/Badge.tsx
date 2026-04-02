// src/components/ui/Badge.tsx

import React from 'react'
import './Badge.css'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>
}
