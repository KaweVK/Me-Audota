CREATE TYPE pet_status AS ENUM ('DISPONIVEL', 'ADOTADO', 'PROCESSO_DE_ADOCAO');
CREATE TYPE pet_sexo AS ENUM ('M', 'F');
CREATE TYPE pet_especie AS ENUM ('CACHORRO', 'GATO', 'OUTRO');

ALTER TABLE pet
    ALTER COLUMN status TYPE pet_status USING status::pet_status,
    ALTER COLUMN sexo TYPE pet_sexo USING sexo::pet_sexo,
    ALTER COLUMN especie TYPE pet_especie USING especie::pet_especie;