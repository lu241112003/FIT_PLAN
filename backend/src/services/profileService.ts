// src/services/profileService.ts

import { UserProfile } from '../models/UserProfile'
import { profileRepository } from '../repositories/profileRepository'
import { userRepository } from '../repositories/userRepository'
import { calculateIMC, getIMCCategory, getTMB, getTDEE } from '../utils/calculateIMC'
import { ApiError } from '../utils/apiError'

export class ProfileService {
  async createOrUpdateProfile(
    userId: string,
    profileData: any
  ): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    let profile = await profileRepository.findByUserId(userId)

    if (profile) {
      profile = await profileRepository.update(userId, profileData)
    } else {
      profile = await profileRepository.create({
        user_id: userId,
        ...profileData,
      })
    }

    return this.enrichProfileWithCalculations(profile)
  }

  async getProfile(userId: string): Promise<any> {
    const profile = await profileRepository.findByUserId(userId)
    if (!profile) {
      throw ApiError.notFound('Perfil não encontrado. Crie um perfil primeiro.')
    }

    return this.enrichProfileWithCalculations(profile)
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await profileRepository.findByUserId(userId)
    if (!profile) {
      throw ApiError.notFound('Perfil não encontrado')
    }

    await profileRepository.delete(userId)
  }

  private enrichProfileWithCalculations(profile: UserProfile): any {
    const imc = calculateIMC(profile.peso_kg, profile.altura_cm)
    const imcCategory = getIMCCategory(imc)

    // Calcular idade
    const birthDate = new Date(profile.data_nascimento)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    const tmb = getTMB(
      profile.peso_kg,
      profile.altura_cm,
      age,
      profile.sexo as 'masculino' | 'feminino'
    )

    const activityLevel = 1.375 // Padrão: pouco ativo
    const tdee = getTDEE(tmb, activityLevel)

    return {
      ...profile,
      imc: parseFloat(imc.toFixed(2)),
      imcCategory,
      idade: age,
      tmb: parseFloat(tmb.toFixed(2)),
      tdee: parseFloat(tdee.toFixed(2)),
    }
  }

  async addFoodRestriction(userId: string, restricao: string): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await profileRepository.addRestriction({
      user_id: userId,
      restricao,
    })
  }

  async getFoodRestrictions(userId: string): Promise<any[]> {
    return await profileRepository.getRestrictions(userId)
  }

  async removeFoodRestriction(restrictionId: string): Promise<void> {
    await profileRepository.removeRestriction(restrictionId)
  }
}

export const profileService = new ProfileService()
