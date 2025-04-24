-- Criando tabela de usuários
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criando usuário admin padrão (senha: admin123)
INSERT INTO "users" ("name", "email", "password", "createdAt", "updatedAt")
VALUES (
    'Administrador',
    'admin@elitefinder.com',
    '$2b$10$h5s9fLjnrNWWHZOAzfQ9S.NWKSirToMA12VCffN4GITmyUzb01xoO',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Criando tabela de armazéns
CREATE TABLE IF NOT EXISTS "ARMAZEM" (
    "ArmazemId" SERIAL PRIMARY KEY,
    "Codigo" INTEGER UNIQUE NOT NULL,
    "Nome" VARCHAR(255) NOT NULL,
    "CNPJ" VARCHAR(14) UNIQUE NOT NULL
);

-- Criando tabela de cursos
CREATE TABLE IF NOT EXISTS "courses" (
    "course_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT
);

-- Criando tabela de interações
CREATE TABLE IF NOT EXISTS "interactions" (
    "interaction_id" SERIAL PRIMARY KEY,
    "totem_id" VARCHAR(50) NOT NULL,
    "selected_color" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criando tabela de relacionamento entre interações e cursos
CREATE TABLE IF NOT EXISTS "interaction_courses" (
    "interaction_id" INTEGER REFERENCES "interactions"("interaction_id"),
    "course_id" INTEGER REFERENCES "courses"("course_id"),
    PRIMARY KEY ("interaction_id", "course_id")
);

-- Criando tabela de logs da API
CREATE TABLE IF NOT EXISTS "API_LOGS" (
    "id" SERIAL PRIMARY KEY,
    "endpoint" VARCHAR(255) NOT NULL,
    "request" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 