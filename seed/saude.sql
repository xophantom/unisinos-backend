-- Escola de Saúde

-- Biomedicina
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Análises Clínicas', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Banco de Sangue', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Microbiologia', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Imagenologia', (SELECT course_id FROM courses WHERE name = 'Biomedicina')),
    ('Reprodução Humana', (SELECT course_id FROM courses WHERE name = 'Biomedicina'));

-- Educação Física
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Personal Trainer', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Técnico(a) de Esportes', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Coordenador(a) de Atividades Físicas', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Ginasta Laboral', (SELECT course_id FROM courses WHERE name = 'Educação Física')),
    ('Professor(a)', (SELECT course_id FROM courses WHERE name = 'Educação Física'));

-- Enfermagem
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Enfermeiro(a)', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Técnico(a) de Enfermagem', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Auxiliar de Enfermagem', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Enfermeiro(a) Prático Licenciado', (SELECT course_id FROM courses WHERE name = 'Enfermagem')),
    ('Assistente de Enfermagem Certificado', (SELECT course_id FROM courses WHERE name = 'Enfermagem'));

-- Farmácia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Farmacêutico(a)', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Analista Clínico', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Gerência de Farmácia', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Analista de Microbiologia', (SELECT course_id FROM courses WHERE name = 'Farmácia')),
    ('Gerência de Farmacoeconomia', (SELECT course_id FROM courses WHERE name = 'Farmácia'));

-- Fisioterapia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Fisioterapeuta', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Gerência de Fisioterapia', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapia Intensivista', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapia em Acupuntura', (SELECT course_id FROM courses WHERE name = 'Fisioterapia')),
    ('Fisioterapia Esportiva', (SELECT course_id FROM courses WHERE name = 'Fisioterapia'));

-- Gastronomia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Chef de Cozinha', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Cozinheiro(a)', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Auxiliar de Cozinha', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Chef de Partida', (SELECT course_id FROM courses WHERE name = 'Gastronomia')),
    ('Maitrê', (SELECT course_id FROM courses WHERE name = 'Gastronomia'));

-- Medicina
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Pediatra', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Médico(a) Geneticista', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Dermatologista', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Cardiologista', (SELECT course_id FROM courses WHERE name = 'Medicina')),
    ('Cirurgião Geral', (SELECT course_id FROM courses WHERE name = 'Medicina'));

-- Nutrição
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Nutrição Clínica', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutrição Hospitalar', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutrição Esportiva', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutrição na Indústria de Alimentos', (SELECT course_id FROM courses WHERE name = 'Nutrição')),
    ('Nutrição em Gastronomia', (SELECT course_id FROM courses WHERE name = 'Nutrição'));

-- Psicologia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Psicologia Clínica', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicologia Escolar', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicologia Hospitalar', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicologia Jurídica', (SELECT course_id FROM courses WHERE name = 'Psicologia')),
    ('Psicologia Social', (SELECT course_id FROM courses WHERE name = 'Psicologia'));