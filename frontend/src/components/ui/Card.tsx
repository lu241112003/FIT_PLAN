// src/components/ui/Card.tsx

import React from 'react'
import './Card.css'

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`card ${className || ''}`}>
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-content">{children}</div>
    </div>
  )
}
