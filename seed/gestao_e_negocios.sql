-- Escola Gestão e Negócios

-- Administração
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultoria de Gestão', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Empreendedorismo', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Gerência de Operações', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Analista Financeiro', (SELECT course_id FROM courses WHERE name = 'Administração')),
    ('Especialista em Marketing', (SELECT course_id FROM courses WHERE name = 'Administração'));

-- Administração - Comércio Exterior
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Importação e Exportação', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Consultoria de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Agente de Carga Internacional', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Despachante Aduaneiro', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior')),
    ('Gerência de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Administração - Comércio Exterior'));

-- Administração - Gestão da Inovação e Liderança
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Direção Executiva', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Gerência de Planejamento Estratégico', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Gerência de Crescimento', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Gerência de Planejamento Estratégico', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança')),
    ('Analista de Marcas', (SELECT course_id FROM courses WHERE name = 'Administração - Gestão da Inovação e Liderança'));

-- Ciências Contabéis
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Empresário(a) Contábil', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Contabilidade Geral', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Controller', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Perícia Contábil', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis')),
    ('Auditoria Fiscal', (SELECT course_id FROM courses WHERE name = 'Ciências Contabéis'));

-- Ciências Econômicas
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista Financeiro', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Consultoria de Economia', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Analista de Operações', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Analista de Dados Econômicos', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas')),
    ('Analista de Mercado', (SELECT course_id FROM courses WHERE name = 'Ciências Econômicas'));

-- Comércio Exterior
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista Internacional', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Analista de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Agente de Carga Internacional', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Despachante Aduaneiro', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior')),
    ('Gerência de Comércio Exterior', (SELECT course_id FROM courses WHERE name = 'Comércio Exterior'));

-- Gestão Comercial
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultoria Comercial', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Consultoria de Vendas', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Representante Comercial', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Assistente Comercial', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial')),
    ('Assistente de Crédito', (SELECT course_id FROM courses WHERE name = 'Gestão Comercial'));

-- Gestão de Recursos Humanos
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente de Recursos Humanos', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Analista de Cargos e Salários', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Coordenação de Recursos Humanos', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Analista de Recrutamento e Seleção', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos')),
    ('Analista de Administração de Pessoal', (SELECT course_id FROM courses WHERE name = 'Gestão de Recursos Humanos'));

-- Gestão Financeira
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultoria de Finanças', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Trader', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Economista Financeiro', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Analista de Crédito', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira')),
    ('Analista de Fundos Financeiros', (SELECT course_id FROM courses WHERE name = 'Gestão Financeira'));

-- Gestão Pública
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Especialista de Políticas Públicas e Gestão Governamental', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Coordenação de Projetos Governamentais', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Consultoria de Gestão Pública', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Gestão de Desenvolvimento Urbano', (SELECT course_id FROM courses WHERE name = 'Gestão Pública')),
    ('Especialista em Relações Governamentais', (SELECT course_id FROM courses WHERE name = 'Gestão Pública'));

-- Logística
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Diretoria de Supply Chain', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Estoquista', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Operação de Logística', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Coordenação de Distribuição', (SELECT course_id FROM courses WHERE name = 'Logística')),
    ('Supervisão de Operações Logísticas', (SELECT course_id FROM courses WHERE name = 'Logística'));

-- Marketing
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Especialista em SEO/SEM', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('Redação', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('UX Designer', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('Analista de Marketing', (SELECT course_id FROM courses WHERE name = 'Marketing')),
    ('Especialista em Marketing Pago', (SELECT course_id FROM courses WHERE name = 'Marketing'));

-- Processos Gerenciais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Gerência de Controle de Qualidade', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Analista de Cargos e Salários', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Gerente Administrativo', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Supervisão', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais')),
    ('Assistente Administrativo', (SELECT course_id FROM courses WHERE name = 'Processos Gerenciais'));