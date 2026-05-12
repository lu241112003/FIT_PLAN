-- ============================================================
-- FITPLAN - Seed: Usuário Admin
-- ============================================================
-- Execute este script no SQL Editor do Supabase para criar
-- um usuário admin padrão
-- 
-- Email: admin@fitplan.com
-- Senha: admin123
-- ============================================================

INSERT INTO users (nome, email, senha_hash)
VALUES (
  'Admin FitPlan',
  'admin@fitplan.com',
  '$2b$12$6uboVx.y2opV/0sJCA7GrOicbgCiSbhmG/JXIUpoEAYokCEW6evae'
)
ON CONFLICT (email) DO UPDATE
SET nome = EXCLUDED.nome,
    senha_hash = EXCLUDED.senha_hash;

-- ============================================================
-- OPCIONAL: Criar perfil padrão para o admin
-- ============================================================
-- Descomente se quiser criar um perfil padrão

/*
-- Primeiro obtenha o ID do usuário admin com:
-- SELECT id FROM users WHERE email = 'admin@fitplan.com';

-- Depois execute (substitua o UUID):
INSERT INTO user_profile (
  user_id,
  sexo,
  data_nascimento,
  peso_kg,
  altura_cm,
  objetivo,
  nivel,
  dias_disponiveis,
  tempo_treino_min
) VALUES (
  'seu-uuid-aqui',
  'masculino',
  '1990-01-01',
  80,
  180,
  'hipertrofia',
  'intermediario',
  4,
  60
);
*/
