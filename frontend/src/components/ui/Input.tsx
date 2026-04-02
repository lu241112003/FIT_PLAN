// src/components/ui/Input.tsx

import React from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  as?: 'input' | 'select' | 'textarea'
  children?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  as = 'input',
  children,
  ...props
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      {as === 'select' ? (
        <select className={`input ${error ? 'input-error' : ''}`} {...(props as any)}>
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea className={`input ${error ? 'input-error' : ''}`} {...(props as any)} />
      ) : (
        <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      )}
      {error && <span className="input-error-text">{error}</span>}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}
