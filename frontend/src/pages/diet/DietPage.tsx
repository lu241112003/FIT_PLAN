// src/pages/diet/DietPage.tsx

import React, { useEffect } from 'react'
import { useDiet } from '../../hooks/useDiet'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Spinner } from '../../components/ui/Spinner'
import './DietPage.css'

export const DietPage: React.FC = () => {
  const { plans, isLoading, getUserPlans, createPlan, deletePlan } = useDiet()

  useEffect(() => {
    getUserPlans()
  }, [getUserPlans])

  const handleCreatePlan = async () => {
    const nome = window.prompt('Nome do plano alimentar:')
    if (!nome) return

    const objetivo = window.prompt('Objetivo (manutencao, emagrecimento, hipertrofia, condicionamento):', 'manutencao')
    if (!objetivo) return

    const calorias = window.prompt('Calorias alvo (kcal):', '2000')
    if (!calorias) return

    await createPlan({
      nome,
      objetivo,
      calorias_alvo: Number(calorias),
    })
  }

  const handleDeletePlan = async (planId: string) => {
    const confirmed = window.confirm('Deseja realmente deletar este plano alimentar?')
    if (!confirmed) return
    await deletePlan(planId)
  }

  const handleViewPlan = (planName?: string | null) => {
    window.alert(`Visualizacao detalhada do plano \"${planName || 'Plano sem nome'}\" sera adicionada na proxima etapa.`)
  }

  return (
    <>
      <Header />
      <div className="diet-container">
        <div className="page-header">
          <h1>Meus Planos Alimentares</h1>
          <Button variant="primary" onClick={handleCreatePlan}>Novo Plano</Button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner />
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p>Você ainda não tem nenhum plano alimentar.</p>
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
                    <strong>Calorias Alvo:</strong> {plan.calorias_alvo} kcal
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
