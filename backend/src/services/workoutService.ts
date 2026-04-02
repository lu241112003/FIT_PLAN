// src/services/workoutService.ts

import { workoutRepository } from '../repositories/workoutRepository'
import { userRepository } from '../repositories/userRepository'
import { ApiError } from '../utils/apiError'

export class WorkoutService {
  async createWorkoutPlan(userId: string, planData: any): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    const plan = await workoutRepository.createPlan({
      user_id: userId,
      ...planData,
      criado_em: new Date().toISOString(),
    })

    return plan
  }

  async getWorkoutPlan(planId: string): Promise<any> {
    const plan = await workoutRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano de treino não encontrado')
    }

    const sessions = await workoutRepository.getSessionsByPlan(planId)
    const sessionsWithExercises = await Promise.all(
      sessions.map(async (session) => {
        const exercises = await workoutRepository.getSessionExercises(session.id)
        return { ...session, exercicios: exercises }
      })
    )

    return {
      ...plan,
      sessoes: sessionsWithExercises,
    }
  }

  async getUserWorkoutPlans(userId: string): Promise<any[]> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await workoutRepository.getUserPlans(userId)
  }

  async updateWorkoutPlan(planId: string, updates: any): Promise<any> {
    const plan = await workoutRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano de treino não encontrado')
    }

    return await workoutRepository.updatePlan(planId, updates)
  }

  async deleteWorkoutPlan(planId: string): Promise<void> {
    const plan = await workoutRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano de treino não encontrado')
    }

    await workoutRepository.deletePlan(planId)
  }

  async addSession(planId: string, sessionData: any): Promise<any> {
    const plan = await workoutRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano de treino não encontrado')
    }

    return await workoutRepository.createSession({
      plano_treino_id: planId,
      ...sessionData,
    })
  }

  async removeSession(sessionId: string): Promise<void> {
    await workoutRepository.deleteSession(sessionId)
  }

  async addExerciseToSession(sessionId: string, exerciseData: any): Promise<any> {
    const exercise = await workoutRepository.getExerciseById(exerciseData.exercicio_id)
    if (!exercise) {
      throw ApiError.notFound('Exercício não encontrado')
    }

    return await workoutRepository.addExerciseToSession({
      sessao_id: sessionId,
      ...exerciseData,
    })
  }

  async removeExerciseFromSession(sessionExerciseId: string): Promise<void> {
    await workoutRepository.removeExerciseFromSession(sessionExerciseId)
  }

  async getAllExercises(): Promise<any[]> {
    return await workoutRepository.getAllExercises()
  }

  async filterExercises(filters: any): Promise<any[]> {
    return await workoutRepository.filterExercises(filters)
  }

  async registerWorkout(userId: string, workoutData: any): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await workoutRepository.registerWorkout({
      user_id: userId,
      data_treino: new Date().toISOString(),
      ...workoutData,
    })
  }

  async getUserWorkouts(userId: string): Promise<any[]> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await workoutRepository.getUserWorkouts(userId)
  }
}

export const workoutService = new WorkoutService()
