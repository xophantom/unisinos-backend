-- Adiciona a coluna quality
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "quality" VARCHAR(100);

-- Atualiza as qualidades das escolas
UPDATE "schools" SET "quality" = 'Defender e argumentar' WHERE "name" = 'Direito';
UPDATE "schools" SET "quality" = 'Cuidar e diagnosticar' WHERE "name" = 'Saúde';
UPDATE "schools" SET "quality" = 'Criar e Comunicar' WHERE "name" = 'Indústria Criativa';
UPDATE "schools" SET "quality" = 'Liderar e Planejar' WHERE "name" = 'Gestão e Negócios';
UPDATE "schools" SET "quality" = 'Construir e Ter raciocínio lógico' WHERE "name" = 'Politécnica';
UPDATE "schools" SET "quality" = 'Educar e Impactar a sociedade' WHERE "name" = 'Humanidades';

-- Torna a coluna NOT NULL após atualizar os dados
ALTER TABLE "schools" ALTER COLUMN "quality" SET NOT NULL; 