import { createContext, useState } from "react";
import type { FoodRestriction, UserProfile } from "../types/user";

export interface ProfileContextType {
  profile: UserProfile | null;
  restrictions: FoodRestriction[];
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setRestrictions: (restrictions: FoodRestriction[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: React.ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [restrictions, setRestrictions] = useState<FoodRestriction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        restrictions,
        isLoading,
        setProfile,
        setRestrictions,
        setIsLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
