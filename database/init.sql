-- ============================================================
--  FITPLAN — Banco de Dados PostgreSQL
--  Sistema Inteligente de Planos de Treino e Alimentação
--  Disciplina: Prática Profissional em Engenharia de Software
-- ============================================================

-- ============================================================
--  EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  ENUMS
-- ============================================================

CREATE TYPE sexo_enum         AS ENUM ('masculino', 'feminino', 'outro');
CREATE TYPE objetivo_enum     AS ENUM ('emagrecimento', 'hipertrofia', 'condicionamento', 'manutencao', 'reabilitacao');
CREATE TYPE nivel_enum        AS ENUM ('iniciante', 'intermediario', 'avancado');
CREATE TYPE dia_semana_enum   AS ENUM ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo');
CREATE TYPE refeicao_enum     AS ENUM ('cafe_manha', 'lanche_manha', 'almoco', 'lanche_tarde', 'jantar', 'ceia');
CREATE TYPE grupo_muscular_enum AS ENUM (
  'peito', 'costas', 'ombros', 'biceps', 'triceps',
  'antebraco', 'abdomen', 'gluteo', 'quadriceps',
  'posterior_coxa', 'panturrilha', 'corpo_todo', 'cardio'
);
CREATE TYPE tipo_exercicio_enum AS ENUM ('forca', 'cardio', 'flexibilidade', 'funcional', 'hiit');
CREATE TYPE status_plano_enum   AS ENUM ('ativo', 'pausado', 'concluido', 'arquivado');
CREATE TYPE status_geracao_enum AS ENUM ('pendente', 'processando', 'concluido', 'erro');
CREATE TYPE tipo_plano_enum     AS ENUM ('treino', 'alimentar', 'completo');

-- ============================================================
--  TABELA: users
--  Autenticação e dados de acesso
-- ============================================================
CREATE TABLE users (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(120)  NOT NULL,
  email         VARCHAR(180)  NOT NULL UNIQUE,
  senha_hash    TEXT          NOT NULL,
  foto_url      TEXT,
  ativo         BOOLEAN       NOT NULL DEFAULT TRUE,
  email_verificado BOOLEAN    NOT NULL DEFAULT FALSE,
  refresh_token TEXT,
  criado_em     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: users_profile
--  Dados físicos e objetivos do usuário
-- ============================================================
CREATE TABLE users_profile (
  id               UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  sexo             sexo_enum    NOT NULL,
  data_nascimento  DATE         NOT NULL,
  peso_kg          NUMERIC(5,2) NOT NULL CHECK (peso_kg > 0),
  altura_cm        SMALLINT     NOT NULL CHECK (altura_cm > 0),
  gordura_pct      NUMERIC(4,1) CHECK (gordura_pct BETWEEN 0 AND 70),
  meta_peso_kg     NUMERIC(5,2) CHECK (meta_peso_kg > 0),
  objetivo         objetivo_enum NOT NULL,
  nivel            nivel_enum    NOT NULL DEFAULT 'iniciante',
  dias_disponiveis SMALLINT      NOT NULL DEFAULT 3 CHECK (dias_disponiveis BETWEEN 1 AND 7),
  tempo_treino_min SMALLINT      NOT NULL DEFAULT 60 CHECK (tempo_treino_min BETWEEN 15 AND 180),
  -- Calculados / desnormalizados para performance
  imc              NUMERIC(4,1)  GENERATED ALWAYS AS (
                     ROUND((peso_kg / ((altura_cm / 100.0) * (altura_cm / 100.0)))::NUMERIC, 1)
                   ) STORED,
  criado_em        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  atualizado_em    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: restricoes_alimentares
--  Alergias / intolerâncias / preferências do usuário
-- ============================================================
CREATE TABLE restricoes_alimentares (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restricao  VARCHAR(80) NOT NULL,   -- ex: "lactose", "glúten", "vegano"
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: condicoes_saude
--  Condições de saúde relevantes para o plano
-- ============================================================
CREATE TABLE condicoes_saude (
  id        UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  condicao  VARCHAR(120) NOT NULL,  -- ex: "hipertensão", "diabetes tipo 2"
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: grupos_musculares
--  Catálogo de grupos musculares
-- ============================================================
CREATE TABLE grupos_musculares (
  id   SMALLSERIAL  PRIMARY KEY,
  nome VARCHAR(60)  NOT NULL UNIQUE,
  slug grupo_muscular_enum NOT NULL UNIQUE
);

-- ============================================================
--  TABELA: exercicios
--  Catálogo de exercícios disponíveis no sistema
-- ============================================================
CREATE TABLE exercicios (
  id                  UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome                VARCHAR(120)      NOT NULL,
  descricao           TEXT,
  instrucoes          TEXT,
  tipo                tipo_exercicio_enum NOT NULL,
  grupo_muscular_id   SMALLINT          REFERENCES grupos_musculares(id),
  grupo_secundario_id SMALLINT          REFERENCES grupos_musculares(id),
  equipamento         VARCHAR(80),       -- ex: "halteres", "barra", "peso_corporal"
  nivel               nivel_enum        NOT NULL DEFAULT 'iniciante',
  video_url           TEXT,
  imagem_url          TEXT,
  calorias_por_min    NUMERIC(5,2),
  ativo               BOOLEAN           NOT NULL DEFAULT TRUE,
  criado_em           TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: alimentos
--  Catálogo de alimentos com informações nutricionais
-- ============================================================
CREATE TABLE alimentos (
  id               UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome             VARCHAR(120) NOT NULL,
  porcao_padrao_g  NUMERIC(6,2) NOT NULL DEFAULT 100,
  calorias         NUMERIC(7,2) NOT NULL,  -- kcal por porção padrão
  proteinas_g      NUMERIC(6,2) NOT NULL,
  carboidratos_g   NUMERIC(6,2) NOT NULL,
  gorduras_g       NUMERIC(6,2) NOT NULL,
  fibras_g         NUMERIC(6,2),
  sodio_mg         NUMERIC(7,2),
  categoria        VARCHAR(60),             -- ex: "proteína animal", "fruta", "cereal"
  vegano           BOOLEAN      NOT NULL DEFAULT FALSE,
  vegetariano      BOOLEAN      NOT NULL DEFAULT FALSE,
  sem_gluten       BOOLEAN      NOT NULL DEFAULT FALSE,
  sem_lactose      BOOLEAN      NOT NULL DEFAULT FALSE,
  ativo            BOOLEAN      NOT NULL DEFAULT TRUE,
  criado_em        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: templates_treino
--  Modelos base de treino que a IA usa como referência
-- ============================================================
CREATE TABLE templates_treino (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_perfil   VARCHAR(40)   NOT NULL,  -- ex: "HIP_INT_4D" (hipertrofia, intermediário, 4 dias)
  nome            VARCHAR(120)  NOT NULL,
  descricao       TEXT,
  objetivo        objetivo_enum NOT NULL,
  nivel           nivel_enum    NOT NULL,
  dias_por_semana SMALLINT      NOT NULL CHECK (dias_por_semana BETWEEN 1 AND 7),
  duracao_semanas SMALLINT      NOT NULL DEFAULT 12,
  ativo           BOOLEAN       NOT NULL DEFAULT TRUE,
  criado_em       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (codigo_perfil)
);

-- ============================================================
--  TABELA: ai_geracoes
--  Log de todas as gerações feitas pela IA
-- ============================================================
CREATE TABLE ai_geracoes (
  id              UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo            tipo_plano_enum   NOT NULL,
  status          status_geracao_enum NOT NULL DEFAULT 'pendente',
  prompt_enviado  TEXT,              -- prompt completo enviado à IA
  resposta_raw    TEXT,              -- resposta bruta da IA (JSON)
  tokens_usados   INTEGER,
  modelo_ia       VARCHAR(80),       -- ex: "claude-sonnet-4-20250514"
  tempo_ms        INTEGER,           -- tempo de resposta em milissegundos
  erro_msg        TEXT,
  criado_em       TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  concluido_em    TIMESTAMPTZ
);

-- ============================================================
--  TABELA: planos_treino
--  Planos de treino gerados pela IA para o usuário
-- ============================================================
CREATE TABLE planos_treino (
  id               UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_geracao_id    UUID             REFERENCES ai_geracoes(id),
  template_id      UUID             REFERENCES templates_treino(id),
  nome             VARCHAR(120)     NOT NULL,
  descricao        TEXT,
  objetivo         objetivo_enum    NOT NULL,
  nivel            nivel_enum       NOT NULL,
  duracao_semanas  SMALLINT         NOT NULL DEFAULT 12,
  status           status_plano_enum NOT NULL DEFAULT 'ativo',
  data_inicio      DATE,
  data_fim         DATE,
  observacoes_ia   TEXT,            -- comentários e dicas gerados pela IA
  criado_em        TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  atualizado_em    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: sessoes_treino
--  Dias/sessões dentro de um plano de treino
-- ============================================================
CREATE TABLE sessoes_treino (
  id                UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  plano_treino_id   UUID            NOT NULL REFERENCES planos_treino(id) ON DELETE CASCADE,
  dia_semana        dia_semana_enum NOT NULL,
  nome_sessao       VARCHAR(80)     NOT NULL,  -- ex: "Treino A - Peito e Tríceps"
  ordem             SMALLINT        NOT NULL,
  duracao_min       SMALLINT        CHECK (duracao_min > 0),
  descricao         TEXT,
  criado_em         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: sessao_exercicios
--  Exercícios dentro de cada sessão de treino
-- ============================================================
CREATE TABLE sessao_exercicios (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessao_id        UUID        NOT NULL REFERENCES sessoes_treino(id) ON DELETE CASCADE,
  exercicio_id     UUID        NOT NULL REFERENCES exercicios(id),
  ordem            SMALLINT    NOT NULL,
  series           SMALLINT    CHECK (series > 0),
  repeticoes       VARCHAR(20),          -- ex: "8-12" ou "15"
  tempo_execucao_s SMALLINT,            -- para exercícios por tempo (segundos)
  descanso_s       SMALLINT    DEFAULT 60,
  carga_kg         NUMERIC(5,2),
  carga_observacao VARCHAR(80),          -- ex: "60% do RM", "peso corporal"
  observacao       TEXT,
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: planos_alimentares
--  Planos alimentares gerados pela IA
-- ============================================================
CREATE TABLE planos_alimentares (
  id              UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_geracao_id   UUID              REFERENCES ai_geracoes(id),
  nome            VARCHAR(120)      NOT NULL,
  descricao       TEXT,
  objetivo        objetivo_enum     NOT NULL,
  calorias_alvo   INTEGER           CHECK (calorias_alvo > 0),
  proteinas_alvo_g NUMERIC(6,2),
  carboidratos_alvo_g NUMERIC(6,2),
  gorduras_alvo_g  NUMERIC(6,2),
  status          status_plano_enum NOT NULL DEFAULT 'ativo',
  data_inicio     DATE,
  data_fim        DATE,
  observacoes_ia  TEXT,
  criado_em       TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: dias_alimentares
--  Dias do plano alimentar (ex: dia de treino vs dia de descanso)
-- ============================================================
CREATE TABLE dias_alimentares (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  plano_alimentar_id  UUID        NOT NULL REFERENCES planos_alimentares(id) ON DELETE CASCADE,
  nome_dia            VARCHAR(60) NOT NULL,   -- ex: "Dia de Treino", "Dia de Descanso"
  ordem               SMALLINT    NOT NULL,
  dia_semana          dia_semana_enum,         -- NULL = válido para qualquer dia
  calorias_total      NUMERIC(7,2),
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: refeicoes
--  Refeições dentro de cada dia alimentar
-- ============================================================
CREATE TABLE refeicoes (
  id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  dia_alimentar_id UUID          NOT NULL REFERENCES dias_alimentares(id) ON DELETE CASCADE,
  tipo_refeicao   refeicao_enum  NOT NULL,
  horario_sugerido TIME,
  nome            VARCHAR(80)    NOT NULL,   -- ex: "Café da Manhã", "Pré-Treino"
  ordem           SMALLINT       NOT NULL,
  calorias_total  NUMERIC(7,2),
  observacao      TEXT,
  criado_em       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: refeicao_alimentos
--  Alimentos de cada refeição com quantidades
-- ============================================================
CREATE TABLE refeicao_alimentos (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  refeicao_id   UUID         NOT NULL REFERENCES refeicoes(id) ON DELETE CASCADE,
  alimento_id   UUID         NOT NULL REFERENCES alimentos(id),
  quantidade_g  NUMERIC(7,2) NOT NULL CHECK (quantidade_g > 0),
  observacao    VARCHAR(120),               -- ex: "cozido", "sem casca"
  -- Calculados para facilitar exibição
  calorias      NUMERIC(7,2),
  proteinas_g   NUMERIC(6,2),
  carboidratos_g NUMERIC(6,2),
  gorduras_g    NUMERIC(6,2),
  criado_em     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: progresso_usuario
--  Histórico de evolução física do usuário
-- ============================================================
CREATE TABLE progresso_usuario (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_registro  DATE         NOT NULL,
  peso_kg        NUMERIC(5,2) NOT NULL,
  gordura_pct    NUMERIC(4,1),
  massa_magra_kg NUMERIC(5,2),
  imc            NUMERIC(4,1),
  foto_url       TEXT,
  observacao     TEXT,
  criado_em      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, data_registro)
);

-- ============================================================
--  TABELA: registros_treino
--  Registro de treinos realizados pelo usuário
-- ============================================================
CREATE TABLE registros_treino (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sessao_id       UUID        REFERENCES sessoes_treino(id),
  plano_treino_id UUID        REFERENCES planos_treino(id),
  data_treino     DATE        NOT NULL,
  duracao_min     SMALLINT,
  concluido       BOOLEAN     NOT NULL DEFAULT FALSE,
  observacao      TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: registro_exercicio_realizado
--  Cargas e séries realizadas em cada exercício do treino
-- ============================================================
CREATE TABLE registro_exercicio_realizado (
  id                   UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_treino_id   UUID         NOT NULL REFERENCES registros_treino(id) ON DELETE CASCADE,
  exercicio_id         UUID         NOT NULL REFERENCES exercicios(id),
  serie                SMALLINT     NOT NULL,
  repeticoes_feitas    SMALLINT,
  carga_kg             NUMERIC(5,2),
  tempo_execucao_s     SMALLINT,
  observacao           VARCHAR(200),
  criado_em            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABELA: feedbacks_plano
--  Avaliações e feedbacks do usuário sobre os planos gerados
-- ============================================================
CREATE TABLE feedbacks_plano (
  id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo        tipo_plano_enum NOT NULL,
  plano_id    UUID            NOT NULL,    -- ID do plano_treino ou plano_alimentar
  nota        SMALLINT        CHECK (nota BETWEEN 1 AND 5),
  comentario  TEXT,
  criado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
--  ÍNDICES DE PERFORMANCE
-- ============================================================

-- users
CREATE INDEX idx_users_email          ON users(email);

-- users_profile
CREATE INDEX idx_profile_user_id      ON users_profile(user_id);
CREATE INDEX idx_profile_objetivo     ON users_profile(objetivo);
CREATE INDEX idx_profile_nivel        ON users_profile(nivel);

-- restricoes_alimentares
CREATE INDEX idx_restricoes_user      ON restricoes_alimentares(user_id);

-- exercicios
CREATE INDEX idx_exercicio_tipo       ON exercicios(tipo);
CREATE INDEX idx_exercicio_nivel      ON exercicios(nivel);
CREATE INDEX idx_exercicio_grupo      ON exercicios(grupo_muscular_id);

-- alimentos
CREATE INDEX idx_alimento_categoria   ON alimentos(categoria);

-- ai_geracoes
CREATE INDEX idx_ai_user_id           ON ai_geracoes(user_id);
CREATE INDEX idx_ai_status            ON ai_geracoes(status);
CREATE INDEX idx_ai_criado_em         ON ai_geracoes(criado_em DESC);

-- planos_treino
CREATE INDEX idx_pt_user_id           ON planos_treino(user_id);
CREATE INDEX idx_pt_status            ON planos_treino(status);

-- sessoes_treino
CREATE INDEX idx_sessao_plano_id      ON sessoes_treino(plano_treino_id);

-- sessao_exercicios
CREATE INDEX idx_se_sessao_id         ON sessao_exercicios(sessao_id);
CREATE INDEX idx_se_exercicio_id      ON sessao_exercicios(exercicio_id);

-- planos_alimentares
CREATE INDEX idx_pa_user_id           ON planos_alimentares(user_id);
CREATE INDEX idx_pa_status            ON planos_alimentares(status);

-- dias_alimentares
CREATE INDEX idx_da_plano_id          ON dias_alimentares(plano_alimentar_id);

-- refeicoes
CREATE INDEX idx_ref_dia_id           ON refeicoes(dia_alimentar_id);

-- refeicao_alimentos
CREATE INDEX idx_ra_refeicao_id       ON refeicao_alimentos(refeicao_id);
CREATE INDEX idx_ra_alimento_id       ON refeicao_alimentos(alimento_id);

-- progresso_usuario
CREATE INDEX idx_prog_user_data       ON progresso_usuario(user_id, data_registro DESC);

-- registros_treino
CREATE INDEX idx_rt_user_data         ON registros_treino(user_id, data_treino DESC);
CREATE INDEX idx_rt_sessao_id         ON registros_treino(sessao_id);

-- registro_exercicio_realizado
CREATE INDEX idx_rer_registro_id      ON registro_exercicio_realizado(registro_treino_id);

-- ============================================================
--  TRIGGERS: atualizado_em automático
-- ============================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_profile_updated
  BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_pt_updated
  BEFORE UPDATE ON planos_treino
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_pa_updated
  BEFORE UPDATE ON planos_alimentares
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
--  VIEWS ÚTEIS
-- ============================================================

-- Perfil completo do usuário para geração de prompts da IA
CREATE VIEW vw_perfil_completo AS
SELECT
  u.id          AS user_id,
  u.nome,
  u.email,
  p.sexo,
  DATE_PART('year', AGE(p.data_nascimento))::SMALLINT AS idade,
  p.peso_kg,
  p.altura_cm,
  p.imc,
  p.gordura_pct,
  p.meta_peso_kg,
  p.objetivo,
  p.nivel,
  p.dias_disponiveis,
  p.tempo_treino_min,
  COALESCE(
    (SELECT STRING_AGG(r.restricao, ', ')
     FROM restricoes_alimentares r WHERE r.user_id = u.id), ''
  ) AS restricoes_alimentares,
  COALESCE(
    (SELECT STRING_AGG(c.condicao, ', ')
     FROM condicoes_saude c WHERE c.user_id = u.id), ''
  ) AS condicoes_saude
FROM users u
JOIN users_profile p ON p.user_id = u.id;

-- Resumo nutricional de um plano alimentar
CREATE VIEW vw_resumo_nutricional AS
SELECT
  pa.id             AS plano_id,
  pa.user_id,
  pa.nome           AS plano_nome,
  da.nome_dia,
  SUM(ra.calorias)       AS total_calorias,
  SUM(ra.proteinas_g)    AS total_proteinas_g,
  SUM(ra.carboidratos_g) AS total_carboidratos_g,
  SUM(ra.gorduras_g)     AS total_gorduras_g
FROM planos_alimentares pa
JOIN dias_alimentares da   ON da.plano_alimentar_id = pa.id
JOIN refeicoes rf          ON rf.dia_alimentar_id   = da.id
JOIN refeicao_alimentos ra ON ra.refeicao_id        = rf.id
GROUP BY pa.id, pa.user_id, pa.nome, da.nome_dia;

-- ============================================================
--  DADOS INICIAIS — Grupos Musculares
-- ============================================================

INSERT INTO grupos_musculares (nome, slug) VALUES
  ('Peito',             'peito'),
  ('Costas',            'costas'),
  ('Ombros',            'ombros'),
  ('Bíceps',            'biceps'),
  ('Tríceps',           'triceps'),
  ('Antebraço',         'antebraco'),
  ('Abdômen',           'abdomen'),
  ('Glúteo',            'gluteo'),
  ('Quadríceps',        'quadriceps'),
  ('Posterior de Coxa', 'posterior_coxa'),
  ('Panturrilha',       'panturrilha'),
  ('Corpo Todo',        'corpo_todo'),
  ('Cardio',            'cardio');

-- ============================================================
--  FIM DO SCRIPT
-- ============================================================