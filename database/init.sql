    
-- ============================================================
-- FITPLAN — Banco de Dados Simplificado
-- Sistema de geração de treinos (algoritmo) e plano alimentar (IA)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE sexo_enum AS ENUM ('masculino','feminino','outro');
CREATE TYPE objetivo_enum AS ENUM ('emagrecimento','hipertrofia','condicionamento','manutencao');
CREATE TYPE nivel_enum AS ENUM ('iniciante','intermediario','avancado');
CREATE TYPE dia_semana_enum AS ENUM ('segunda','terca','quarta','quinta','sexta','sabado','domingo');
CREATE TYPE refeicao_enum AS ENUM ('cafe_manha','lanche_manha','almoco','lanche_tarde','jantar','ceia');

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- USER PROFILE
-- Dados físicos usados para gerar treino e alimentação
-- ============================================================

CREATE TABLE user_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    sexo sexo_enum NOT NULL,
    data_nascimento DATE NOT NULL,
    
    peso_kg NUMERIC(5,2) NOT NULL,
    altura_cm INTEGER NOT NULL,
    
    objetivo objetivo_enum NOT NULL,
    nivel nivel_enum DEFAULT 'iniciante',
    
    dias_disponiveis INTEGER DEFAULT 3,
    tempo_treino_min INTEGER DEFAULT 60,
    
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- RESTRIÇÕES ALIMENTARES
-- ============================================================

CREATE TABLE restricoes_alimentares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    restricao VARCHAR(100) NOT NULL
);

-- ============================================================
-- GRUPOS MUSCULARES
-- ============================================================

CREATE TABLE grupos_musculares (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) UNIQUE NOT NULL
);

-- ============================================================
-- EXERCÍCIOS
-- Catálogo de exercícios
-- ============================================================

CREATE TABLE exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    
    grupo_muscular_id INTEGER REFERENCES grupos_musculares(id),
    
    equipamento VARCHAR(80),
    nivel nivel_enum DEFAULT 'iniciante',
    
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PLANOS DE TREINO
-- Gerados pelo algoritmo
-- ============================================================

CREATE TABLE planos_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    nome VARCHAR(120),
    objetivo objetivo_enum,
    nivel nivel_enum,
    
    duracao_semanas INTEGER DEFAULT 12,
    
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SESSÕES DE TREINO
-- Ex: Treino A, Treino B
-- ============================================================

CREATE TABLE sessoes_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plano_treino_id UUID REFERENCES planos_treino(id) ON DELETE CASCADE,
    
    nome VARCHAR(80),
    dia_semana dia_semana_enum,
    
    ordem INTEGER
);

-- ============================================================
-- EXERCÍCIOS DA SESSÃO
-- ============================================================

CREATE TABLE sessao_exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessao_id UUID REFERENCES sessoes_treino(id) ON DELETE CASCADE,
    
    exercicio_id UUID REFERENCES exercicios(id),
    
    series INTEGER,
    repeticoes VARCHAR(20),
    descanso_s INTEGER DEFAULT 60,
    
    ordem INTEGER
);

-- ============================================================
-- ALIMENTOS
-- Catálogo nutricional
-- ============================================================

CREATE TABLE alimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    
    calorias NUMERIC,
    proteinas_g NUMERIC,
    carboidratos_g NUMERIC,
    gorduras_g NUMERIC
);

-- ============================================================
-- PLANOS ALIMENTARES
-- Gerados pela IA
-- ============================================================

CREATE TABLE planos_alimentares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    nome VARCHAR(120),
    objetivo objetivo_enum,
    
    calorias_alvo INTEGER,
    
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- REFEIÇÕES
-- ============================================================

CREATE TABLE refeicoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plano_id UUID REFERENCES planos_alimentares(id) ON DELETE CASCADE,
    
    tipo refeicao_enum,
    horario TIME,
    
    ordem INTEGER
);

-- ============================================================
-- ALIMENTOS DA REFEIÇÃO
-- ============================================================

CREATE TABLE refeicao_alimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refeicao_id UUID REFERENCES refeicoes(id) ON DELETE CASCADE,
    
    alimento_id UUID REFERENCES alimentos(id),
    
    quantidade_g NUMERIC
);

-- ============================================================
-- PROGRESSO DO USUÁRIO
-- ============================================================

CREATE TABLE progresso_usuario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    data_registro DATE,
    peso_kg NUMERIC(5,2),
    
    observacao TEXT
);

-- ============================================================
-- TREINOS REALIZADOS
-- ============================================================

CREATE TABLE treinos_realizados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    plano_treino_id UUID REFERENCES planos_treino(id),
    
    data_treino DATE,
    duracao_min INTEGER,
    
    observacao TEXT
);

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

INSERT INTO grupos_musculares (nome) VALUES
('Peito'),
('Costas'),
('Ombros'),
('Bíceps'),
('Tríceps'),
('Abdômen'),
('Glúteos'),
('Quadríceps'),
('Posterior de Coxa'),
('Panturrilha'),
('Corpo Todo');
