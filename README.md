# FitPlan - Sistema de Planejamento de Treinos e Alimentação

## 📋 Descrição
FitPlan é uma aplicação full-stack para planejamento personalizado de treinos e planos alimentares, com cálculo de métricas corporais e gerenciamento de progresso.

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js com TypeScript
- **Framework:** Express.js
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** JWT com Refresh Tokens
- **Criptografia:** bcryptjs para hashing de senhas
- **Validação:** Zod

### Frontend
- **Framework:** React 18 com TypeScript
- **Roteamento:** React Router v6
- **HTTP Client:** Axios com Interceptadores
- **State Management:** React Context API
- **Estilos:** CSS Puro + CSS Variables

## 📁 Estrutura do Projeto

```
FITPLAN/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Configuração Express
│   │   ├── server.ts              # Entry point
│   │   ├── ai/                    # Serviços de IA
│   │   ├── config/                # Configurações (CORS, DB, ENV)
│   │   ├── controllers/           # Controladores (Auth, User, Diet, Workout, Profile)
│   │   ├── middlewares/           # Middlewares (Auth, Error, Validation)
│   │   ├── models/                # Tipos de Dados
│   │   ├── repositories/          # Camada de Acesso a Dados
│   │   ├── routes/                # Definição de Rotas
│   │   ├── services/              # Lógica de Negócios
│   │   ├── types/                 # Type Definitions
│   │   └── utils/                 # Utilitários (JWT, Hash, IMC, etc)
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Componente raiz
│   │   ├── index.tsx              # Entry point
│   │   ├── components/
│   │   │   ├── layout/            # Header, Footer, Sidebar, PrivateRoute
│   │   │   └── ui/                # Button, Input, Card, Modal, Spinner, Badge
│   │   ├── context/               # AuthContext, ProfileContext
│   │   ├── hooks/                 # Custom hooks (useAuth, useProfile, useDiet, useWorkout)
│   │   ├── pages/
│   │   │   ├── auth/              # Login, Register
│   │   │   ├── dashboard/         # Dashboard principal
│   │   │   ├── diet/              # Gerenciamento de planos alimentares
│   │   │   ├── profile/           # Edição de perfil
│   │   │   └── workout/           # Gerenciamento de planos de treino
│   │   ├── routes/                # AppRoutes com BrowserRouter
│   │   ├── services/              # API calls (auth, user, diet, workout)
│   │   ├── styles/                # Global CSS e CSS Variables
│   │   ├── types/                 # Type Definitions
│   │   └── utils/                 # Utilitários (formatters, masks, calcs)
│   ├── .env.example
│   ├── tsconfig.json
│   ├── public/                    # index.html, manifest.json
│   └── package.json
├── database/
│   ├── init.sql                   # Script de inicialização do DB
│   ├── supabase.js                # Cliente Supabase
│   └── migrations/                # Migrações
├── docs/
│   ├── arquitetura.md             # Documentação da arquitetura
│   ├── modelo-dados.md            # Modelo de dados
│   └── rotas-api.md               # Documentação das rotas
└── README.md
```

## 🚀 Instalação e Setup

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn
- Conta no Supabase (para banco de dados)

### Backend

1. Instale as dependências:
```bash
cd backend
npm install
```

2. Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

3. Configure as variáveis de ambiente (especialmente Supabase):
```
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
JWT_SECRET=seu_secret_jwt_unico
JWT_REFRESH_SECRET=seu_refresh_secret_unico
```

4. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Crie um arquivo `.env.local` baseado no `.env.example`:
```bash
cp .env.example .env.local
```

3. Inicie a aplicação:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) com:
- **Access Token:** Válido por 7 dias
- **Refresh Token:** Válido por 30 dias
- **Storage:** LocalStorage do navegador

### Fluxo de Login
1. Usuário envia email e senha
2. Backend valida e retorna access_token e refresh_token
3. Frontend armazena tokens no localStorage
4. Todas as requisições incluem `Authorization: Bearer {token}` no header
5. Se token expirar, frontend usa refresh_token para obter novo access_token

## 📊 API Endpoints Principais

### Autenticação (`/api/auth`)
```
POST   /register              # Registrar novo usuário
POST   /login                 # Fazer login
POST   /change-password       # Alterar senha (requer autenticação)
GET    /me                    # Obter dados do usuário autenticado
```

### Usuários (`/api/users`)
```
GET    /profile               # Obter perfil do usuário
PUT    /profile               # Atualizar perfil
DELETE /account               # Deletar conta do usuário
GET    /stats                 # Obter estatísticas (IMC, TMB, TDEE)
```

### Perfil (`/api/profile`)
```
POST   /                      # Criar/atualizar perfil
GET    /                      # Obter perfil completo
DELETE /                      # Deletar perfil
POST   /restrictions          # Adicionar restrição alimentar
GET    /restrictions          # Listar restrições
DELETE /restrictions/:id      # Remover restrição específica
```

### Dieta (`/api/diet`)
```
POST   /plans                 # Criar novo plano alimentar
GET    /plans                 # Listar planos do usuário
GET    /plans/:id             # Obter detalhes de um plano
PUT    /plans/:id             # Atualizar plano
DELETE /plans/:id             # Deletar plano
POST   /meals                 # Adicionar refeição a um plano
DELETE /meals/:id             # Remover refeição
POST   /foods                 # Adicionar alimento a uma refeição
DELETE /foods/:id             # Remover alimento
GET    /foods                 # Listar alimentos disponíveis
GET    /foods/search          # Buscar alimentos por termo
POST   /progress              # Registrar progresso de peso
GET    /progress              # Obter histórico de progresso
```

### Treino (`/api/workout`)
```
POST   /plans                 # Criar novo plano de treino
GET    /plans                 # Listar planos do usuário
GET    /plans/:id             # Obter detalhes de um plano
PUT    /plans/:id             # Atualizar plano
DELETE /plans/:id             # Deletar plano
POST   /sessions              # Adicionar sessão a um plano
DELETE /sessions/:id          # Remover sessão
POST   /session-exercises     # Adicionar exercício a uma sessão
DELETE /session-exercises/:id # Remover exercício
GET    /exercises             # Listar exercícios disponíveis
GET    /exercises/filter      # Filtrar exercícios por critérios
POST   /workout-logs          # Registrar treino realizado
GET    /workout-logs          # Obter histórico de treinos
```

## 🎯 Recursos Implementados

### Backend ✅
- Autenticação com JWT e Refresh Tokens
- CRUD completo para Usuários, Perfis, Dietas e Treinos
- Cálculo automático de IMC, TMB (Taxa Metabólica Basal) e TDEE (Gasto Calórico Diário)
- Gerenciamento de restrições alimentares
- Registro de progresso físico com histórico
- Filtro avançado de exercícios por grupo muscular, nível e equipamento
- Tratamento robusto de erros com classes customizadas
- Validação de dados com Zod
- Middlewares para autenticação, validação e tratamento de erros
- CORS configurado para desenvolvimento local

### Frontend ✅
- Sistema de autenticação completo (login, registro, logout)
- Dashboard com resumo de informações do usuário (IMC, stats, links rápidos)
- Gerenciamento de perfil do usuário
- Interfaces para listagem e criação de planos alimentares
- Interfaces para listagem e criação de planos de treino
- Componentes reutilizáveis (Button, Input, Card, Modal, Spinner, Badge)
- Contextos React para gerenciamento de estado (Auth, Profile)
- Hooks customizados para business logic (useAuth, useProfile, useDiet, useWorkout)
- Proteção de rotas com PrivateRoute
- Layout responsivo com Header, Footer, Sidebar
- Máscaras de entrada para CPF, telefone, moeda
- CSS responsivo com variáveis de tema

## 📈 Métricas Implementadas

### IMC (Índice de Massa Corporal)
```
IMC = peso (kg) / altura (m)²
Categorias: Abaixo do peso, Peso normal, Sobrepeso, Obeso (I, II, III)
```

### TMB (Taxa Metabólica Basal)
Cálculo usando fórmula de Harris-Benedict para estimar calorias básicas diárias.

### TDEE (Gasto Calórico Diário Total)
```
TDEE = TMB × Fator de Atividade
Fatores: Sedentário (1.2), Leve (1.375), Moderado (1.55), Ativo (1.725), Muito Ativo (1.9)
```

## 🔍 Modelos de Dados

### User
- id, nome, email, senha_hash, criado_em, atualizado_em

### UserProfile
- id, user_id, sexo, data_nascimento, peso_kg, altura_cm, objective, nível, dias_disponíveis, tempo_treino_min

### DietPlan
- id, user_id, name, objetivo, calorias_alvo, criado_em

### WorkoutPlan
- id, user_id, name, objetivo, nível, duracao_semanas, criado_em

### Exercício
- id, nome, descrição, grupo_muscular_id, equipamento, nível

## 🚧 Próximas Melhorias Sugeridas

- [ ] Integração com IA (Groq API) para geração automática de planos
- [ ] Testes unitários e de integração
- [ ] Cache com Redis para melhor performance
- [ ] WebSockets para atualizações em tempo real
- [ ] Sistema de notificações
- [ ] Exportar planos em PDF
- [ ] Gráficos de progresso
- [ ] Chat com nutricionista/personal trainer
- [ ] Aplicativo mobile com React Native
- [ ] Sistema de pagamento/assinatura

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores:
1. Abra uma issue primeiro para discutir as mudanças propostas
2. Faça um fork do projeto
3. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para reportar bugs ou sugerir features, abra uma issue no repositório.