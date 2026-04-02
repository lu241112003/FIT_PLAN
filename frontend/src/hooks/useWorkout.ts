// src/hooks/useWorkout.ts

import { useCallback, useState } from 'react'
import { WorkoutPlan, Exercise } from '../types/workout'
import * as workoutService from '../services/workoutService'

export function useWorkout() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUserPlans = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await workoutService.getUserWorkoutPlans()
      setPlans(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar planos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAllExercises = async () => {
    setIsLoading(true)
    try {
      const data = await workoutService.getAllExercises()
      setExercises(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar exercícios')
    } finally {
      setIsLoading(false)
    }
  }

  const createPlan = useCallback(async (planData: any) => {
    setIsLoading(true)
    try {
      const newPlan = await workoutService.createWorkoutPlan(planData)
      setPlans((prev) => [...prev, newPlan])
      setError(null)
      return newPlan
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar plano')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deletePlan = useCallback(async (planId: string) => {
    setIsLoading(true)
    try {
      await workoutService.deleteWorkoutPlan(planId)
      setPlans((prev) => prev.filter((p: WorkoutPlan) => p.id !== planId))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar plano')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const filterExercises = async (filters: any) => {
    setIsLoading(true)
    try {
      const data = await workoutService.filterExercises(filters)
      setExercises(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao filtrar exercícios')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    plans,
    exercises,
    isLoading,
    error,
    getUserPlans,
    getAllExercises,
    createPlan,
    deletePlan,
    filterExercises,
  }
}
