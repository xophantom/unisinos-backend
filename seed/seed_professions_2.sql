-- Escola Humanidades
-- Ciências Sociais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Cientista Social', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Assistente Social', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Consultor em Diversidade e Inclusão', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Professor de Ciências Sociais', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Sociólogo', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais'));

-- Filosofia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Pesquisador', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Escritor', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Produtor de conhecimento Filosófico', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Consultor de ética', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Curador de museus ou exposições culturais', (SELECT course_id FROM courses WHERE name = 'Filosofia'));

-- História
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Historiador', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Professor de História', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Arqueólogo', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Curador de exposições', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Conservador de museus', (SELECT course_id FROM courses WHERE name = 'História'));

-- Letras
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Professor de Português', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Professor de Literatura', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Tradutor', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Escritor', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Interprete', (SELECT course_id FROM courses WHERE name = 'Letras'));

-- Pedagogia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Coordenador pedagógico', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Professor na Educação Básica', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Orientador educacional', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Psicopedagogo', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Neuropsicopedagogo institucional', (SELECT course_id FROM courses WHERE name = 'Pedagogia'));

-- Relações Internacionais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Diplomata', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Consultor Internacional', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Gerente de Relações Internacionais', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Oficial de Programas Internacionais', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Analista de Riscos Globais', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais'));

-- Serviço Social
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Articulador Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Conselheiro Tutelar', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Consultor de Responsabilidade Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Coordenador de Projeto Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')); 