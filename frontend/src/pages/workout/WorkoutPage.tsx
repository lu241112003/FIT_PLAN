// src/pages/workout/WorkoutPage.tsx

import React, { useEffect } from 'react'
import { useWorkout } from '../../hooks/useWorkout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Spinner } from '../../components/ui/Spinner'
import './WorkoutPage.css'

export const WorkoutPage: React.FC = () => {
  const { plans, isLoading, getUserPlans, createPlan, deletePlan } = useWorkout()

  useEffect(() => {
    getUserPlans()
  }, [getUserPlans])

  const handleCreatePlan = async () => {
    const nome = window.prompt('Nome do plano de treino:')
    if (!nome) return

    const objetivo = window.prompt('Objetivo (manutencao, emagrecimento, hipertrofia, condicionamento):', 'hipertrofia')
    if (!objetivo) return

    const nivel = window.prompt('Nivel (iniciante, intermediario, avancado):', 'iniciante')
    if (!nivel) return

    const semanas = window.prompt('Duracao (semanas):', '8')
    if (!semanas) return

    await createPlan({
      nome,
      objetivo,
      nivel,
      duracao_semanas: Number(semanas),
    })
  }

  const handleDeletePlan = async (planId: string) => {
    const confirmed = window.confirm('Deseja realmente deletar este plano de treino?')
    if (!confirmed) return
    await deletePlan(planId)
  }

  const handleViewPlan = (planName?: string | null) => {
    window.alert(`Visualizacao detalhada do plano \"${planName || 'Plano sem nome'}\" sera adicionada na proxima etapa.`)
  }

  return (
    <>
      <Header />
      <div className="workout-container">
        <div className="page-header">
          <h1>Meus Planos de Treino</h1>
          <Button variant="primary" onClick={handleCreatePlan}>Novo Plano</Button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner />
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p>Você ainda não tem nenhum plano de treino.</p>
              <p>Clique no botão "Novo Plano" para começar!</p>
            </div>
          </Card>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <Card key={plan.id} title={plan.nome || 'Plano Sem Nome'}>
                <div className="plan-info">
                  <p>
                    <strong>Objetivo:</strong> {plan.objetivo}
                  </p>
                  <p>
                    <strong>Nível:</strong> {plan.nivel}
                  </p>
                  <p>
                    <strong>Duração:</strong> {plan.duracao_semanas} semanas
                  </p>
                  <div className="plan-actions">
                    <Button size="sm" variant="primary" onClick={() => handleViewPlan(plan.nome)}>
                      Ver
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeletePlan(plan.id)}>
                      Deletar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
