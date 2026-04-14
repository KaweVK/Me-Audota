ALTER TABLE pet
ADD COLUMN anunciante_id BIGINT NOT NULL,
ADD CONSTRAINT fk_pet_usuario
    FOREIGN KEY (anunciante_id) REFERENCES usuario(id) ON DELETE CASCADE;