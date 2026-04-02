// src/context/ProfileContext.tsx

import React, { createContext, useState } from 'react'
import { UserProfile, FoodRestriction } from '../types/user'

export interface ProfileContextType {
  profile: UserProfile | null
  restrictions: FoodRestriction[]
  isLoading: boolean
  setProfile: (profile: UserProfile | null) => void
  setRestrictions: (restrictions: FoodRestriction[]) => void
  setIsLoading: (loading: boolean) => void
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [restrictions, setRestrictions] = useState<FoodRestriction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const value: ProfileContextType = {
    profile,
    restrictions,
    isLoading,
    setProfile,
    setRestrictions,
    setIsLoading,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
