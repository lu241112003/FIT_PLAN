// src/pages/dashboard/Dashboard.tsx

import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/ui/Spinner'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { calculateIMC, formatDate, getIMCLabel } from '../../utils/calculateIMC'
import * as profileService from '../../services/userService'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await profileService.getUserStats()
        setStats(data)
      } catch (error) {
        console.error('Erro ao carregar stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#080808' }}>
        <Spinner />
      </div>
    )
  }

  const imc = stats?.profile
    ? calculateIMC(stats.profile.peso_kg, stats.profile.altura_cm)
    : null

  const initials = user?.nome
    ? user.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const caloriasHoje = stats?.calorias_hoje ?? 0
  const metaCalorias = stats?.meta_calorias ?? 2800
  const calPct = Math.min((caloriasHoje / metaCalorias) * 100, 100)
  const ringCirc = 276.46
  const ringOffset = ringCirc - (ringCirc * calPct) / 100

  return (
    <>
      <Header />
      <div className="db">

        {/* Hero */}
        <div className="db-hero">
          <div>
            <h1 className="db-greeting">
              Bem-vindo, <span className="db-greeting-muted">{user?.nome?.split(' ')[0]}</span>
            </h1>
            <p className="db-date">{formatDate(new Date().toISOString())}</p>
          </div>
          <div className="db-avatar">{initials}</div>
        </div>

        {/* Stats */}
        <p className="db-section-label">Resumo físico</p>
        <div className="db-stats-row">
          <div className="db-stat">
            <span className="db-stat-label">IMC</span>
            <span className="db-stat-value">{imc ? imc.toFixed(1) : '—'}</span>
            {imc && <span className="db-stat-badge">{getIMCLabel(imc)}</span>}
          </div>
          <div className="db-stat">
            <span className="db-stat-label">Peso atual</span>
            <span className="db-stat-value">{stats?.profile?.peso_kg ?? '—'}</span>
            <span className="db-stat-unit">kg</span>
          </div>
          <div className="db-stat">
            <span className="db-stat-label">Altura</span>
            <span className="db-stat-value">{stats?.profile?.altura_cm ?? '—'}</span>
            <span className="db-stat-unit">cm</span>
          </div>
          <div className="db-stat">
            <span className="db-stat-label">Objetivo</span>
            <span className="db-stat-value db-stat-value--sm">
              {stats?.profile?.objetivo ?? '—'}
            </span>
          </div>
        </div>

        {/* Linha 1: Info pessoal + Progresso */}
        <div className="db-mid-row">
          <div className="db-card">
            <p className="db-card-title">Informações pessoais</p>
            <div className="db-info-list">
              <div className="db-info-row">
                <span className="db-info-key">Nome</span>
                <span className="db-info-val">{user?.nome}</span>
              </div>
              <div className="db-info-row">
                <span className="db-info-key">Email</span>
                <span className="db-info-val db-info-val--sm">{user?.email}</span>
              </div>
              <div className="db-info-row">
                <span className="db-info-key">Membro desde</span>
                <span className="db-info-val">
                  {stats?.profile?.created_at ? formatDate(stats.profile.created_at) : '—'}
                </span>
              </div>
              <div className="db-info-row">
                <span className="db-info-key">Plano</span>
                <span className="db-info-val">{stats?.profile?.plano ?? 'Gratuito'}</span>
              </div>
              <div className="db-info-row">
                <span className="db-info-key">Último acesso</span>
                <span className="db-info-val">Hoje</span>
              </div>
            </div>
          </div>

          <div className="db-card">
            <p className="db-card-title">Progresso semanal</p>
            <div className="db-progress-list">
              <ProgressRow label="Treinos realizados"     value={stats?.treinos_semana ?? 0}   max={stats?.meta_treinos ?? 5} unit="treinos" />
              <ProgressRow label="Refeições registradas"  value={stats?.refeicoes_semana ?? 0} max={7}                        unit="refeições" />
              <ProgressRow label="Meta de água"           value={stats?.agua_litros ?? 0}      max={2.5}                      unit="L" decimals={1} />
              <ProgressRow label="Calorias diárias"       value={caloriasHoje}                 max={metaCalorias}             unit="kcal" />
              <ProgressRow label="Sono registrado"        value={stats?.sono_horas ?? 0}       max={8}                        unit="h" decimals={1} />
            </div>
          </div>
        </div>

        {/* Linha 2: Nav + Atividade + Calorias */}
        <div className="db-bot-row">

          <div className="db-card">
            <p className="db-card-title">Navegação rápida</p>
            <div className="db-nav-grid">
              <NavItem href="/diet"     label="Dieta"      sub="Planos alimentares"  icon={<IconMenu />} />
              <NavItem href="/workout"  label="Treino"     sub="Planos & séries"     icon={<IconDumbbell />} />
              <NavItem href="/profile"  label="Perfil"     sub="Dados pessoais"      icon={<IconUser />} />
              <NavItem href="/progress" label="Progresso"  sub="Histórico & metas"   icon={<IconActivity />} />
            </div>
          </div>

          <div className="db-card">
            <p className="db-card-title">Atividade recente</p>
            <div className="db-activity-list">
              {stats?.atividades?.length > 0
                ? stats.atividades.map((a: any, i: number) => (
                    <div className="db-act-row" key={i}>
                      <span className={`db-act-dot${i < 2 ? ' db-act-dot--active' : ''}`} />
                      <span className="db-act-text">{a.descricao}</span>
                      <span className="db-act-time">{a.data}</span>
                    </div>
                  ))
                : <p className="db-empty">Nenhuma atividade registrada ainda.</p>
              }
            </div>
          </div>

          <div className="db-card">
            <p className="db-card-title">Calorias hoje</p>
            <div className="db-ring-wrap">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle
                  cx="55" cy="55" r="44"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                />
                <circle
                  cx="55" cy="55" r="44"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="8"
                  strokeDasharray={ringCirc}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                />
                <text x="55" y="51" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="18" fontWeight="700" fontFamily="system-ui">
                  {caloriasHoje}
                </text>
                <text x="55" y="66" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="system-ui">
                  de {metaCalorias} kcal
                </text>
              </svg>
            </div>
            <div className="db-macro-row">
              <div className="db-macro">
                <span className="db-macro-val">{stats?.proteina_g ?? 0}g</span>
                <span className="db-macro-lbl">Proteína</span>
              </div>
              <div className="db-macro">
                <span className="db-macro-val">{stats?.carbo_g ?? 0}g</span>
                <span className="db-macro-lbl">Carbo</span>
              </div>
              <div className="db-macro">
                <span className="db-macro-val">{stats?.gordura_g ?? 0}g</span>
                <span className="db-macro-lbl">Gordura</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}

// ── Sub-componentes ──────────────────────────────────────────

interface ProgressRowProps {
  label: string
  value: number
  max: number
  unit: string
  decimals?: number
}

const ProgressRow: React.FC<ProgressRowProps> = ({ label, value, max, unit, decimals = 0 }) => {
  const pct = Math.min((value / max) * 100, 100)
  const fmt = (n: number) => decimals > 0 ? n.toFixed(decimals) : String(n)
  return (
    <div className="db-prog-item">
      <div className="db-prog-header">
        <span className="db-prog-label">{label}</span>
        <span className="db-prog-val">{fmt(value)} / {fmt(max)} {unit}</span>
      </div>
      <div className="db-prog-track">
        <div className="db-prog-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  label: string
  sub: string
  icon: React.ReactNode
}

const NavItem: React.FC<NavItemProps> = ({ href, label, sub, icon }) => (
  <a href={href} className="db-nav-item">
    <div className="db-nav-icon">{icon}</div>
    <div>
      <p className="db-nav-label">{label}</p>
      <p className="db-nav-sub">{sub}</p>
    </div>
  </a>
)

// ── Ícones ───────────────────────────────────────────────────

const IconMenu = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)
const IconDumbbell = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 4v16M18 4v16M6 12h12" />
  </svg>
)
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)