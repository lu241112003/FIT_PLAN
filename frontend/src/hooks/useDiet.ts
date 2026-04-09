import { useCallback, useState } from "react";
import type { DietPlan, Food } from "../types/diet";
import * as dietService from "../services/dietService";

export function useDiet() {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dietService.getUserDietPlans();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar planos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllFoods = async () => {
    setIsLoading(true);
    try {
      const data = await dietService.getAllFoods();
      setFoods(data as Food[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar alimentos");
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = useCallback(async (planData: any) => {
    setIsLoading(true);
    try {
      const newPlan = await dietService.createDietPlan(planData);
      setPlans((prev) => [...prev, newPlan]);
      setError(null);
      return newPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar plano");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlan = useCallback(async (planId: string) => {
    setIsLoading(true);
    try {
      await dietService.deleteDietPlan(planId);
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar plano");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchFoods = async (term: string) => {
    setIsLoading(true);
    try {
      const data = await dietService.searchFoods(term);
      setFoods(data as Food[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar alimentos");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plans,
    foods,
    isLoading,
    error,
    getUserPlans,
    getAllFoods,
    createPlan,
    deletePlan,
    searchFoods,
  };
}
