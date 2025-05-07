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

-- Criando tabela de escolas
CREATE TABLE IF NOT EXISTS "schools" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "color" VARCHAR(50) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN DEFAULT true
);

-- Inserindo dados das escolas
INSERT INTO "schools" ("name", "color", "url") VALUES
    ('Humanidades', 'laranja', 'https://www.unisinos.br/escolas/humanidades'),
    ('Politécnica', 'verde', 'https://www.unisinos.br/escolas/politecnica'),
    ('Saúde', 'verde claro', 'https://www.unisinos.br/escolas/saude'),
    ('Direito', 'vermelho', 'https://www.unisinos.br/escolas/direito'),
    ('Gestão e Negócios', 'azul', 'https://www.unisinos.br/escolas/gestao-e-negocios'),
    ('Indústria Criativa', 'rosa', 'https://www.unisinos.br/escolas/industria-criativa')
ON CONFLICT (name) DO NOTHING;

-- Criando tabela de cursos
CREATE TABLE IF NOT EXISTS "courses" (
    "course_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "school_id" INTEGER REFERENCES "schools"("id")
);

-- Criando tabela de profissões
CREATE TABLE IF NOT EXISTS "professions" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "course_id" INTEGER REFERENCES "courses"("course_id")
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