// src/pages/profile/ProfilePage.tsx

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Spinner } from '../../components/ui/Spinner'
import * as profileService from '../../services/userService'
import './ProfilePage.css'

export const ProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { profile, setProfile, isLoading, setIsLoading } = useProfile()
  const [formData, setFormData] = useState({
    sexo: 'masculino',
    data_nascimento: '',
    peso_kg: 0,
    altura_cm: 0,
    objetivo: 'manutencao',
    nivel: 'iniciante',
    dias_disponiveis: 3,
    tempo_treino_min: 60,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (profile) return
      setIsLoading(true)
      try {
        const currentProfile = await profileService.getUserProfile()
        if (currentProfile) {
          setProfile(currentProfile)
        }
      } catch {
        // Perfil ainda nao existe para esse usuario
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [profile, setIsLoading, setProfile])

  useEffect(() => {
    if (profile) {
      setFormData({
        sexo: profile.sexo,
        data_nascimento: profile.data_nascimento,
        peso_kg: profile.peso_kg,
        altura_cm: profile.altura_cm,
        objetivo: profile.objetivo,
        nivel: profile.nivel,
        dias_disponiveis: profile.dias_disponiveis,
        tempo_treino_min: profile.tempo_treino_min,
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const updatedProfile = await profileService.updateUserProfile({
        ...formData,
        sexo: formData.sexo as 'masculino' | 'feminino' | 'outro',
        objetivo: formData.objetivo as 'manutencao' | 'emagrecimento' | 'hipertrofia' | 'condicionamento',
        nivel: formData.nivel as 'iniciante' | 'intermediario' | 'avancado'
      })
      setProfile(updatedProfile)
      setSuccess('Perfil atualizado com sucesso!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Meu Perfil</h1>

        <Card title="Informações Pessoais">
          <form onSubmit={handleSubmit} className="profile-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {!profile && !isLoading && (
              <div className="success-message">Perfil ainda nao cadastrado. Preencha os campos e salve para criar.</div>
            )}

            <div className="form-grid">
              <Input
                label="Sexo"
                as="select"
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </Input>

              <Input
                label="Data de Nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) =>
                  setFormData({ ...formData, data_nascimento: e.target.value })
                }
              />

              <Input
                label="Peso (kg)"
                type="number"
                step="0.1"
                value={formData.peso_kg}
                onChange={(e) =>
                  setFormData({ ...formData, peso_kg: parseFloat(e.target.value) })
                }
              />

              <Input
                label="Altura (cm)"
                type="number"
                value={formData.altura_cm}
                onChange={(e) =>
                  setFormData({ ...formData, altura_cm: parseInt(e.target.value) })
                }
              />

              <Input
                label="Objetivo"
                as="select"
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              >
                <option value="emagrecimento">Emagrecimento</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="condicionamento">Condicionamento</option>
                <option value="manutencao">Manutenção</option>
              </Input>

              <Input
                label="Nível"
                as="select"
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </Input>

              <Input
                label="Dias Disponíveis"
                type="number"
                min="1"
                max="7"
                value={formData.dias_disponiveis}
                onChange={(e) =>
                  setFormData({ ...formData, dias_disponiveis: parseInt(e.target.value) })
                }
              />

              <Input
                label="Tempo de Treino (minutos)"
                type="number"
                step="15"
                value={formData.tempo_treino_min}
                onChange={(e) =>
                  setFormData({ ...formData, tempo_treino_min: parseInt(e.target.value) })
                }
              />
            </div>

            <Button type="submit" isLoading={isLoading}>
              Salvar Alterações
            </Button>
          </form>
        </Card>
      </div>
      <Footer />
    </>
  )
}
