# Projeto Fullstack de Autenticação e Gerenciamento de Usuários

Sistema simples para cadastro, login e listagem de usuários com backend em NestJS (Node.js) e frontend em React.  
Autenticação baseada em JWT com refresh token. Proteção de rotas no backend via guards.

---

## Tecnologias

- Backend: NestJS, Prisma ORM, JWT, bcrypt
- Frontend: React, Axios
- Banco de Dados: PostgreSQL (pode adaptar para outro)
- Ferramentas: Postman para testes, GitHub para versionamento

---

## Funcionalidades

- Cadastro de usuário (email e senha)
- Login e geração de tokens JWT e refresh token
- Rotas protegidas via JWT
- Listagem de usuários (apenas para admins)
- Visualização do perfil do usuário logado
- Refresh de token para renovar sessão

---

## Requisitos para rodar

- Node.js >= 18
- PostgreSQL (ou outro banco configurado no DATABASE_URL)

Copie o arquivo exemplo .env.example para .env e configure as variáveis:
DATABASE_URL=postgresql://usuario:senha@localhost:5432/seubanco
JWT_SECRET=sua_chave_jwt_secreta
JWT_REFRESH_SECRET=sua_chave_refresh_token


npx prisma migrate dev
Endpoints principais da API
Método	Rota	Descrição	Autenticação
POST	/auth/signup	Cadastrar novo usuário	Não
POST	/auth/signin	Login	Não
POST	/auth/refresh	Renovar token JWT	Não (usa refresh token)
GET	/users	Listar todos usuários	Sim, apenas admins
GET	/users/:id	Buscar usuário pelo ID	Sim, admin ou próprio usuário
GET	/users/profile	Perfil do usuário logado	Sim


Frontend - fluxos principais
Cadastro: formulário envia dados para /auth/signup

Login: formulário envia para /auth/signin e salva tokens localmente

Listagem usuários: faz GET em /users com token no header (somente admins)

Perfil: mostra dados do usuário logado /users/profile

