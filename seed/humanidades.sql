-- Escola Humanidades

-- Ciências Sociais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Cientista Social', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Assistente Social', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Consultoria em Diversidade e Inclusão', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Professor(a) de Ciências Sociais', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais')),
    ('Sociólogo(a)', (SELECT course_id FROM courses WHERE name = 'Ciências Sociais'));

-- Filosofia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Pesquisador(a)', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Escritor(a)', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Produtor(a) de Conhecimento Filosófico', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Consultoria de Ética', (SELECT course_id FROM courses WHERE name = 'Filosofia')),
    ('Curadoria de Museus ou Exposições Culturais', (SELECT course_id FROM courses WHERE name = 'Filosofia'));

-- História
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Historiador(a)', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Professor(a) de História', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Arqueologia', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Curadoria de Exposições', (SELECT course_id FROM courses WHERE name = 'História')),
    ('Conservação de Museus', (SELECT course_id FROM courses WHERE name = 'História'));

-- Letras
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Professor(a) de Português', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Professor(a) de Literatura', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Tradutor(a)', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Escritor(a)', (SELECT course_id FROM courses WHERE name = 'Letras')),
    ('Interprete', (SELECT course_id FROM courses WHERE name = 'Letras'));

-- Pedagogia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Coordenador(a) Pedagógico', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Professor(a) na Educação Básica', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Orientação Educacional', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Psicopedagogo(a)', (SELECT course_id FROM courses WHERE name = 'Pedagogia')),
    ('Neuropsicopedagogo(a) Institucional', (SELECT course_id FROM courses WHERE name = 'Pedagogia'));

-- Relações Internacionais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Diplomata', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Consultoria Internacional', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Gerência de Relações Internacionais', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Oficial de Programas Internacionais', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais')),
    ('Analista de Riscos Globais', (SELECT course_id FROM courses WHERE name = 'Relações Internacionais'));

-- Serviço Social
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Articulador(a) Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Conselheiro(a) Tutelar', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Consultor(a) de Responsabilidade Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social')),
    ('Coordenação de Projeto Social', (SELECT course_id FROM courses WHERE name = 'Serviço Social'));

