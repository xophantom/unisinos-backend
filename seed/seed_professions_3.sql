-- Escola Politécnica
-- Análise e Desenvolvimento de Sistemas
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvedor de software', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Analista de infraestrutura de TI', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Arquiteto da informação', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Administrador de banco de dados', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Analista programador', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas'));

-- Arquitetura e Urbanismo
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Arquiteto de edifícios', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Analista de arquitetura', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Analista de incorporação', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Arquiteto de patrimônio', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Arquiteto de interiores', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo'));

-- Biologia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Biólogo', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Geneticista', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Ecologista', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Microbiologista', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Zoólogo', (SELECT course_id FROM courses WHERE name = 'Biologia'));

-- Ciência da Computação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvedor de Software', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Cientista de Dados', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Analista de Sistemas', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Arquiteto de Software', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Engenheiro de Software', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação'));

-- Engenharia Agronômica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Agrônomo', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Administrador Rural', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Agrotécnico', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Zootecnista', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Desenvolvedor sustentável', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica'));

-- Engenharia Biomédica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro Biomédico', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Especialista em Equipamentos Médicos', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Pesquisador em Tecnologias Biomédicas', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Consultor em Engenharia Biomédica', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Desenvolvedor de Dispositivos Médicos', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica'));

-- Engenharia Civil
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro Civil', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Engenheiro de Estruturas', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Engenheiro de Transportes', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Engenheiro de Saneamento', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Engenheiro de Construção', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil'));

-- Engenharia da Computação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro de Software', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Arquiteto de Sistemas', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Engenheiro de Redes', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Engenheiro de Hardware', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Engenheiro de Sistemas Embarcados', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação'));

-- Engenharia de Controle e Automação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro de Controle e Automação', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Engenheiro de Automação Industrial', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Engenheiro de Sistemas de Controle', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Engenheiro de Robótica', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Engenheiro de Instrumentação', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação'));

-- Engenharia de Produção
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro de Produção', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Engenheiro de Processos', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Engenheiro de Qualidade', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Engenheiro de Logística', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Engenheiro de Planejamento', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção'));

-- Engenharia Elétrica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro Eletricista', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Engenheiro de Sistemas de Potência', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Engenheiro de Eletrônica', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Engenheiro de Telecomunicações', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Engenheiro de Automação', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica'));

-- Engenharia Mecânica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro Mecânico', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Engenheiro de Projetos Mecânicos', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Engenheiro de Manutenção', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Engenheiro de Processos de Fabricação', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Engenheiro de Materiais', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica'));

-- Engenharia Química
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro Químico', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Engenheiro de Processos Químicos', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Engenheiro de Controle de Qualidade', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Engenheiro de Segurança Industrial', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Engenheiro de Meio Ambiente', (SELECT course_id FROM courses WHERE name = 'Engenharia Química'));

-- Física
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Físico', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Pesquisador em Física', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Professor de Física', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Físico Médico', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Físico Nuclear', (SELECT course_id FROM courses WHERE name = 'Física'));

-- Geologia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Geólogo', (SELECT course_id FROM courses WHERE name = 'Geologia')),
    ('Geólogo de Exploração', (SELECT course_id FROM courses WHERE name = 'Geologia')),
    ('Geólogo Ambiental', (SELECT course_id FROM courses WHERE name = 'Geologia')),
    ('Geólogo de Mineração', (SELECT course_id FROM courses WHERE name = 'Geologia')),
    ('Geólogo de Petróleo', (SELECT course_id FROM courses WHERE name = 'Geologia'));

-- Gestão da Produção Industrial
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Gerente de Produção', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Analista de Processos Industriais', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Supervisor de Produção', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Coordenador de Produção', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Consultor de Produção Industrial', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial'));

-- Gestão da Tecnologia da Informação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Gerente de TI', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Analista de Sistemas', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Coordenador de TI', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Consultor de TI', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Analista de Infraestrutura', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação'));

-- Jogos Digitais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvedor de Jogos', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Game Designer', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Artista de Jogos', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Programador de Jogos', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Produtor de Jogos', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais'));

-- Matemática
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Matemático', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Professor de Matemática', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Pesquisador em Matemática', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Analista de Dados', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Consultor Matemático', (SELECT course_id FROM courses WHERE name = 'Matemática'));

-- Segurança da Informação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista de Segurança', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Consultor de Segurança', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Especialista em Cibersegurança', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Auditor de Segurança', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Gerente de Segurança da Informação', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação'));

-- Sistemas para Internet
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvedor Web', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Analista de Sistemas Web', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Arquiteto de Soluções Web', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Desenvolvedor Front-end', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Desenvolvedor Back-end', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')); 