// src/components/ui/Spinner.tsx

import React from 'react'
import './Spinner.css'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = '#007bff' }) => {
  return (
    <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }}>
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
