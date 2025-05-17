-- Direito
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Juiz(a)', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Advogado(a)', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Delegado(a)', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Promotor(a)', (SELECT course_id FROM courses WHERE name = 'Direito')),
    ('Procurador(a)', (SELECT course_id FROM courses WHERE name = 'Direito'));
