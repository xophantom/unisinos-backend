-- Escola de Humanidades
-- BIHAT
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Produtor Cultural', (SELECT course_id FROM courses WHERE name = 'BIHAT')),
    ('Gestor Cultural', (SELECT course_id FROM courses WHERE name = 'BIHAT')),
    ('Curador', (SELECT course_id FROM courses WHERE name = 'BIHAT')),
    ('Pesquisador Cultural', (SELECT course_id FROM courses WHERE name = 'BIHAT')),
    ('Consultor Cultural', (SELECT course_id FROM courses WHERE name = 'BIHAT'));

-- Comunicação Digital
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Social Media Manager', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Content Creator', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Analista de Mídias Sociais', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Gestor de Conteúdo Digital', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital')),
    ('Estrategista Digital', (SELECT course_id FROM courses WHERE name = 'Comunicação Digital'));

-- Design
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Designer Gráfico', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Designer de Produto', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Designer de Interface', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Designer de Moda', (SELECT course_id FROM courses WHERE name = 'Design')),
    ('Designer de Interiores', (SELECT course_id FROM courses WHERE name = 'Design'));

-- Jornalismo
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Jornalista', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Repórter', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Editor', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Apresentador', (SELECT course_id FROM courses WHERE name = 'Jornalismo')),
    ('Redator', (SELECT course_id FROM courses WHERE name = 'Jornalismo'));

-- Moda
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Estilista', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Designer de Moda', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Produtor de Moda', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Consultor de Moda', (SELECT course_id FROM courses WHERE name = 'Moda')),
    ('Visual Merchandiser', (SELECT course_id FROM courses WHERE name = 'Moda'));

-- Produção Audiovisual
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Produtor Audiovisual', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Diretor de Cinema', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Editor de Vídeo', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Roteirista', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual')),
    ('Diretor de Fotografia', (SELECT course_id FROM courses WHERE name = 'Produção Audiovisual'));

-- Produção Fonográfica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Produtor Musical', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Engenheiro de Som', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Mixador', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Masterizador', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica')),
    ('Técnico de Som', (SELECT course_id FROM courses WHERE name = 'Produção Fonográfica'));

-- Publicidade e Propaganda
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Publicitário', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Diretor de Arte', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Redator Publicitário', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Planejador de Mídia', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda')),
    ('Estrategista de Marketing', (SELECT course_id FROM courses WHERE name = 'Publicidade e Propaganda'));

-- Realização Audiovisual
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Realizador Audiovisual', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Diretor de Cinema', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Produtor de Cinema', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Roteirista', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual')),
    ('Diretor de Fotografia', (SELECT course_id FROM courses WHERE name = 'Realização Audiovisual'));

-- Relações Públicas
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Relacionista Público', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Assessor de Imprensa', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Gestor de Comunicação', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Consultor de Imagem', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')),
    ('Gestor de Eventos', (SELECT course_id FROM courses WHERE name = 'Relações Públicas')); 