-- Escola Gestão e Negócios
-- Administração
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultor de Gestão', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Empreendedor', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Gerente de operações', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Analista financeiro', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Especialista em Marketing', (SELECT course_id FROM courses WHERE name = 'Administração'));

-- Administração - Comércio Exterior
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Importador/Exportador', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Consultor de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Agente de Carga Internacional', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Despachante Aduaneiro', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Gerente de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior'));

-- Administração - Gestão da Inovação e Liderança
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Diretor Executivo', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Gerente de Planejamento Estratégico', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Gerente de Crescimento', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Analista de Marcas', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Consultor de Inovação', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança'));

-- Ciências Contabéis
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Empresário Contábil', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Contador geral', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Controller', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Perito Contábil', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Auditor fiscal', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis'));

-- Ciências Econômicas
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista Financeiro', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Consultor econômico', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Analista de operações', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Analista de dados econômicos', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Analista de mercado', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas'));

-- Comércio Exterior
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista internacional', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Analista de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Agente de Carga Internacional', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Despachante Aduaneiro', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Gerente de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior'));

-- Gestão Comercial
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultor comercial', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Consultor de vendas', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Representante comercial', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Assistente comercial', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Assistente de crédito', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial'));

-- Gestão de Recursos Humanos
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente de Recursos Humanos', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Analista de Cargos e Salários', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Coordenador de Recursos Humanos', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Analista de recrutamento e seleção', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Analista de Administração de Pessoal', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos'));

-- Gestão Financeira
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultor Financeiro', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Trader', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Economista financeiro', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Analista de crédito', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Analista de fundos financeiros', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira'));

-- Gestão Pública
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Especialista de Políticas Públicas e Gestão Governamental', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Coordenador de Projetos Governamentais', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Consultor de Gestão Pública', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Gestor de Desenvolvimento Urbano', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Especialista em Relações Governamentais', (SELECT course_id FROM courses WHERE name = 'Gestão Pública'));

-- Logística
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Diretor de supply chain', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Estoquista', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Operador de Logística', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Coordenador de distribuição', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Supervisor de operações logísticas', (SELECT course_id FROM courses WHERE name = 'Logística'));

-- Marketing
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Especialista em SEO/SEM', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('Redator de conteúdo', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('UX Designer', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('Analista de marketing', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('Especialista em marketing pago', (SELECT course_id FROM courses WHERE name = 'Marketing'));

-- Processos Gerenciais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Gerente de Controle de Qualidade', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Analista de Cargos e Salários', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Gerente Administrativo', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Supervisor Administrativo', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Assistente Administrativo', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')); 