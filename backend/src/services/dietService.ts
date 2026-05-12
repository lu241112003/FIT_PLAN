import { dietRepository } from '../repositories/dietRepository'
import { userRepository } from '../repositories/userRepository'
import { ApiError } from '../utils/apiError'

export class DietService {
  async createDietPlan(userId: string, planData: any): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    const plan = await dietRepository.createPlan({
      user_id: userId,
      ...planData,
      criado_em: new Date().toISOString(),
    })

    return plan
  }

  async getDietPlan(planId: string): Promise<any> {
    const plan = await dietRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano alimentar não encontrado')
    }

    const meals = await dietRepository.getMealsByPlan(planId)
    const mealsWithFoods = await Promise.all(
      meals.map(async (meal) => {
        const foods = await dietRepository.getMealFoods(meal.id)
        return { ...meal, alimentos: foods }
      })
    )

    return {
      ...plan,
      refeicoes: mealsWithFoods,
    }
  }

  async getUserDietPlans(userId: string): Promise<any[]> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await dietRepository.getUserPlans(userId)
  }

  async updateDietPlan(planId: string, updates: any): Promise<any> {
    const plan = await dietRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano alimentar não encontrado')
    }

    return await dietRepository.updatePlan(planId, updates)
  }

  async deleteDietPlan(planId: string): Promise<void> {
    const plan = await dietRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano alimentar não encontrado')
    }

    await dietRepository.deletePlan(planId)
  }

  async addMeal(planId: string, mealData: any): Promise<any> {
    const plan = await dietRepository.getPlanById(planId)
    if (!plan) {
      throw ApiError.notFound('Plano alimentar não encontrado')
    }

    return await dietRepository.createMeal({
      plano_id: planId,
      ...mealData,
    })
  }

  async removeMeal(mealId: string): Promise<void> {
    await dietRepository.deleteMeal(mealId)
  }

  async addFoodToMeal(mealId: string, foodId: string, quantidade_g: number): Promise<any> {
    const food = await dietRepository.getFoodById(foodId)
    if (!food) {
      throw ApiError.notFound('Alimento não encontrado')
    }

    return await dietRepository.addFoodToMeal({
      refeicao_id: mealId,
      alimento_id: foodId,
      quantidade_g,
    })
  }

  async removeFoodFromMeal(mealFoodId: string): Promise<void> {
    await dietRepository.removeFoodFromMeal(mealFoodId)
  }

  async searchFoods(searchTerm: string): Promise<any[]> {
    if (!searchTerm || searchTerm.length < 2) {
      return []
    }

    return await dietRepository.searchFoods(searchTerm)
  }

  async getAllFoods(): Promise<any[]> {
    return await dietRepository.getAllFoods()
  }

  async addProgress(userId: string, peso_kg: number, observacao?: string): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await dietRepository.addProgress({
      user_id: userId,
      peso_kg,
      observacao,
      data_registro: new Date().toISOString(),
    })
  }

  async getUserProgress(userId: string): Promise<any[]> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    return await dietRepository.getUserProgress(userId)
  }
}

export const dietService = new DietService()
