# Brev.ly

## Desafio Fase 1 da POS TECH 360 RocketSeat

### Objetivo
Criar uma aplicação que permita o cadastro, listagem e remoção de links encurtados, geração de relatório dos acessos de cada link e também o redirecionamento correto do link encurtado par ao link original.

### Pré requisitos

  - NodeJS 22+
  - Docker e Docker compose

### 1. Clonar o repositório
  ```bash
  git clone https://github.com/Xt-Man/rocketseat-brevly.git
  cd rocketseat-brevly
  ```
### 2. Backend
  ```bash
  cd server
  
  # copiar arquivo de variáveis de ambiente
  cp .env.example .env
  # configure-o de acordo

  # instalar dependências
  npm install

  # executar PostgreSQL via docker
  docker compose up -d

  # executar migrations no banco de dados
  npm run db:migrate

  # iniciar o server em devenvolvimento
  npm run dev

  ```
  - para testar acesse: `http://localhost:3333/hello`

  - para ver os endpoints disponíveis acesse: `http://localhost:3333/docs`


### 3. Frontend
  ```bash
  cd web
  
  # copiar arquivo de variáveis de ambiente
  cp .env.example .env
  # configure-o de acordo

  # instalar dependências
  npm install

  # iniciar o server em devenvolvimento
  npm run dev
  ```
  - o frontend estará disponível em: `http://localhost:5173`