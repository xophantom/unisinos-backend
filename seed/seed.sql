-- Inserindo cursos da Escola Gestão e Negócios
INSERT INTO "courses" ("name", "school_id") VALUES
    ('Administração', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Administração - Comércio Exterior', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Administração - Gestão da Inovação e Liderança', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Ciências Contabéis', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Ciências Econômicas', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Comércio Exterior', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Gestão Comercial', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Gestão de Recursos Humanos', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Gestão Financeira', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Gestão Pública', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Logística', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Marketing', (SELECT id FROM schools WHERE name = 'Gestão e Negócios')),
    ('Processos Gerenciais', (SELECT id FROM schools WHERE name = 'Gestão e Negócios'));

-- Inserindo cursos da Escola Humanidades
INSERT INTO "courses" ("name", "school_id") VALUES
    ('Ciências Sociais', (SELECT id FROM schools WHERE name = 'Humanidades')),
    ('Filosofia', (SELECT id FROM schools WHERE name = 'Humanidades')),
    ('História', (SELECT id FROM schools WHERE name = 'Humanidades')),
    ('Letras', (SELECT id FROM schools WHERE name = 'Humanidades')),
    ('Pedagogia', (SELECT id FROM schools WHERE name = 'Humanidades')),
    ('Relações Internacionais', (SELECT id FROM schools WHERE name = 'Humanidades')),
    ('Serviço Social', (SELECT id FROM schools WHERE name = 'Humanidades'));

-- Inserindo cursos da Escola Politécnica
INSERT INTO "courses" ("name", "school_id") VALUES
    ('Análise e Desenvolvimento de Sistemas', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Arquitetura e Urbanismo', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Biologia', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Ciência da Computação', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia Agronômica', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia Biomédica', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia Cívil', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia da Computação', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia de Controle e Automação', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia de Produção', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia Elétrica', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia Mecânica', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Engenharia Química', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Física', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Geologia', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Gestão da Produção Industrial', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Gestão da Tecnologia da Informação', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Jogos Digitais', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Matemática', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Segurança da Informação', (SELECT id FROM schools WHERE name = 'Politécnica')),
    ('Sistemas para Internet', (SELECT id FROM schools WHERE name = 'Politécnica'));

-- Inserindo cursos da Escola Indústria Criativa
INSERT INTO "courses" ("name", "school_id") VALUES
    ('BIHAT', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Comunicação Digital', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Design', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Jornalismo', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Moda', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Produção Audiovisual', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Produção Fonográfica', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Publicidade e Propaganda', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Realização Audiovisual', (SELECT id FROM schools WHERE name = 'Indústria Criativa')),
    ('Relações Públicas', (SELECT id FROM schools WHERE name = 'Indústria Criativa'));

-- Inserindo cursos da Escola Direito
INSERT INTO "courses" ("name", "school_id") VALUES
    ('Direito', (SELECT id FROM schools WHERE name = 'Direito'));

-- Inserindo cursos da Escola Saúde
INSERT INTO "courses" ("name", "school_id") VALUES
    ('Biomedicina', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Educação Física', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Enfermagem', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Farmácia', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Fisioterapia', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Gastronomia', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Medicina', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Nutrição', (SELECT id FROM schools WHERE name = 'Saúde')),
    ('Psicologia', (SELECT id FROM schools WHERE name = 'Saúde'));

