-- Escola Politécnica

-- Análise e Desenvolvimento de Sistemas
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvimento de Software', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Analista de Infraestrutura de TI', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Arquiteto(a) da Informação', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Administração de Banco de Dados', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas')),
    ('Analista Programador', (SELECT course_id FROM courses WHERE name = 'Análise e Desenvolvimento de Sistemas'));

-- Arquitetura e Urbanismo
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Arquiteto(a) de Edifícios', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Analista de Arquitetura', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Analista de Incorporação', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Arquiteto(a) de Patrimônio', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo')),
    ('Arquiteto(a) de Interiores', (SELECT course_id FROM courses WHERE name = 'Arquitetura e Urbanismo'));

-- Biologia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Biólogo(a)', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Geneticista', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Ecologista', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Microbiologista', (SELECT course_id FROM courses WHERE name = 'Biologia')),
    ('Zoólogo(a)', (SELECT course_id FROM courses WHERE name = 'Biologia'));

-- Ciência da Computação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvimento de Software', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Cientista de Dados', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Engenheiro(a) de Inteligência Artificial e Aprendizado de Máquina', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Administrador(a) de Banco de Dados', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação')),
    ('Diretor(a) de Segurança da Informação', (SELECT course_id FROM courses WHERE name = 'Ciência da Computação'));

-- Engenharia Agronômica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Agrônomo(a)', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Administrador(a) Rural', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Agrotécnico(a)', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Zootecnista', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica')),
    ('Desenvolvedor(a) Sustentável', (SELECT course_id FROM courses WHERE name = 'Engenharia Agronômica'));

-- Engenharia Biomédica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Bioinformática', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Desenvolvimento de Próteses e Biomateriais', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Imagiologia', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Desenvolvimento de Equipamentos', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica')),
    ('Pesquisador(a) Científico', (SELECT course_id FROM courses WHERE name = 'Engenharia Biomédica'));

-- Engenharia Cívil
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Engenheiro(a) Cívil', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Construtor(a) Cívil', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Segurança do Trabalho', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Gestor(a) de Obras', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil')),
    ('Arquiteto(a) de Infraestrutura', (SELECT course_id FROM courses WHERE name = 'Engenharia Cívil'));

-- Engenharia da Computação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvimento de Software', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Arquiteto(a) de Software', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Analista de Sistemas', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Diretor(a) de Tecnologia', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação')),
    ('Líder Técnico em Segurança Cibernética', (SELECT course_id FROM courses WHERE name = 'Engenharia da Computação'));

-- Engenharia de Controle e Automação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista de Automação', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Supervisão de Processos Industriais', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Desenvolvimento de Sistemas de Instrumentação', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Operação de Processos Industriais', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação')),
    ('Segurança Operacional', (SELECT course_id FROM courses WHERE name = 'Engenharia de Controle e Automação'));

-- Engenharia de Produção
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Gerência de Projetos', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Gerência de Produção', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Supervisão de Produção', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Coordenação de Produção', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção')),
    ('Agente de Controle de Qualidade', (SELECT course_id FROM courses WHERE name = 'Engenharia de Produção'));

-- Engenharia Elétrica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Sistemas de Controle', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Eletrotécnica', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Desenvolvimento de Redes de Transmissão', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Programação de Processos Automatizados', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica')),
    ('Energia e Energias Renováveis', (SELECT course_id FROM courses WHERE name = 'Engenharia Elétrica'));

-- Engenharia Mecânica
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista de Projetos', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Gestão de Projetos', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Construtoria de Máquinas Industriais', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Engenheiro(a) de Vendas Mecânicas', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica')),
    ('Engenheiro(a) Mecânico', (SELECT course_id FROM courses WHERE name = 'Engenharia Mecânica'));

-- Engenharia Química
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Assistente de Análises Químicas e Controle de Qualidade', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Biotecnólogo(a)', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Consultoria', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Gerente de Planta', (SELECT course_id FROM courses WHERE name = 'Engenharia Química')),
    ('Engenheiro(a) de Minas', (SELECT course_id FROM courses WHERE name = 'Engenharia Química'));

-- Física
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Físico de Pesquisa', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Meteorologista', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Física Médico', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Geofísico(a)', (SELECT course_id FROM courses WHERE name = 'Física')),
    ('Cientista de Materiais', (SELECT course_id FROM courses WHERE name = 'Física'));

-- Geologia
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Geólogo(a)', (SELECT course_id FROM courses WHERE name = 'Geologia')),
    ('Técnico em Geologia', (SELECT course_id FROM courses WHERE name = 'Geologia')),
    ('Analista de Geologia', (SELECT course_id FROM courses WHERE name = 'Geologia'));

-- Gestão da Produção Industrial
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Técnico(a) de Produção', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Agente de Controle de Qualidade', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Embalador(a)', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Montador(a)', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial')),
    ('Gerente de Projetos', (SELECT course_id FROM courses WHERE name = 'Gestão da Produção Industrial'));

-- Gestão da Tecnologia da Informação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista de Sistemas', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Administração de Redes', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Consultoria de TI', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Administração de Banco de Dados (DBA)', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação')),
    ('Gerência de Segurança de TI', (SELECT course_id FROM courses WHERE name = 'Gestão da Tecnologia da Informação'));

-- Jogos Digitais
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Desenvolvimento de Jogos', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Programação de Jogos', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Game Designer', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Narrativista', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais')),
    ('Game Tester (QA)', (SELECT course_id FROM courses WHERE name = 'Jogos Digitais'));

-- Matemática
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Professor(a) de Matemática', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Pesquisador(a)', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Economista', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Analista de Dados', (SELECT course_id FROM courses WHERE name = 'Matemática')),
    ('Atuário', (SELECT course_id FROM courses WHERE name = 'Matemática'));

-- Segurança da Informação
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Consultoria de Segurança', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Analista de Governança de TI', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Analista de Gestão de Incidentes', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Analista de Tecnologia da Informação', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação')),
    ('Engenheiro(a) de Segurança', (SELECT course_id FROM courses WHERE name = 'Segurança da Informação'));

-- Sistemas para Internet
INSERT INTO "professions" ("name", "course_id") VALUES
    ('Analista de Suporte Web', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Programação Java EE', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Gerência de Projetos Web', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Desenvolvimento de Aplicativos', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet')),
    ('Programador(a) PHP', (SELECT course_id FROM courses WHERE name = 'Sistemas para Internet'));

