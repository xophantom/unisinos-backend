-- Escola de Direito
-- Direito
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Advogado', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Juiz', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Promotor de Justiça', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Defensor Público', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Procurador', (SELECT course_id FROM courses WHERE name = 'Direito'));

-- Escola de Saúde
-- Biomedicina
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Biomédico', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Pesquisador em Biomedicina', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Analista Clínico', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Especialista em Análises Clínicas', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Consultor em Biomedicina', (SELECT course_id FROM courses WHERE name = 'Biomedicina'));

-- Educação Física
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Professor de Educação Física', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Personal Trainer', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Preparador Físico', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Fisioterapeuta Esportivo', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Gestor Esportivo', (SELECT course_id FROM courses WHERE name = 'Educação Física'));

-- Enfermagem
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Enfermeiro', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Enfermeiro de UTI', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Enfermeiro Obstétrico', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Enfermeiro de Saúde Pública', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Gestor de Enfermagem', (SELECT course_id FROM courses WHERE name = 'Enfermagem'));

-- Farmácia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Farmacêutico', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Farmacêutico Clínico', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Farmacêutico Industrial', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Farmacêutico Hospitalar', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Farmacêutico de Análises Clínicas', (SELECT course_id FROM courses WHERE name = 'Farmácia'));

-- Fisioterapia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Fisioterapeuta', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapeuta Neurológico', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapeuta Ortopédico', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapeuta Respiratório', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapeuta Esportivo', (SELECT course_id FROM courses WHERE name = 'Fisioterapia'));

-- Gastronomia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Chef de Cozinha', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Cozinheiro', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Confeiteiro', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Gestor de Restaurante', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Consultor Gastronômico', (SELECT course_id FROM courses WHERE name = 'Gastronomia'));

-- Medicina
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Médico', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Médico Clínico Geral', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Médico Especialista', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Médico de Família', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Médico Pesquisador', (SELECT course_id FROM courses WHERE name = 'Medicina'));

-- Nutrição
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Nutricionista', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutricionista Clínico', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutricionista Esportivo', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutricionista Hospitalar', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Consultor Nutricional', (SELECT course_id FROM courses WHERE name = 'Nutrição'));

-- Psicologia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Psicólogo', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicólogo Clínico', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicólogo Organizacional', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicólogo Escolar', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicólogo Social', (SELECT course_id FROM courses WHERE name = 'Psicologia')); 