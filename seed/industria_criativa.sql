-- BIHAT
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Produtor de Conteudo Audiovisual', (SELECT course_id FROM courses WHERE name = 'BIHAT')),
    ('Gestor de Projetos', (SELECT course_id FROM courses WHERE name = 'BIHAT'));

-- Comunicação Digital
INSERT INTO "professions" ("name", "course_id") VALUES
    ('User Experience', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Social Media', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Customer Success', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Produção de Conteúdo', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Analista de Redes Sociais', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital'));

-- Design
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Web Designer', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Direção de Arte', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Direção de Criação', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('UX/UI Designer', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Design de Personagens', (SELECT course_id FROM courses WHERE name = 'Design'));

-- Jornalismo
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Repórter', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Apresentador(a)', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Diretor(a) de Redação', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Fotojornalista', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Assessoria de Imprensa', (SELECT course_id FROM courses WHERE name = 'Jornalismo'));

-- Moda
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Estilista', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Modelista', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Consultoria de Imagem', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Produção de Moda', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Gerência de Marca de Moda', (SELECT course_id FROM courses WHERE name = 'Moda'));

-- Produção Audiovisual
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente de Produção', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Roteirista', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Diretor(a) de Fotografia', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Diretor(a) de Cena', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Técnico(a) de Som Direto', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual'));

-- Produção Fonográfica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Produtor(a) Musical', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Técnico(a) de Estúdio', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Músico', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Operação de Som', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Instrumentista', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica'));

-- Publicidade e Propaganda
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Redator(a)', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Planejamento Estratégico', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Produtor(a) Gráfico', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Analista de Mídia', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Social Media Manager', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda'));

-- Realização Audiovisual
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente de Produção', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Roteirista', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Diretor(a) de Fotografia', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Diretor(a) de Cena', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Técnico(a) de Som Direto', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual'));

-- Relações Públicas
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Produtor de Eventos', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Comunicador(a) Corporativo', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Assessoria de Imprensa', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Assessoria de Comunicação', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Coordenador(a) de Relações Públicas', (SELECT course_id FROM courses WHERE name = 'Relações Públicas'));

