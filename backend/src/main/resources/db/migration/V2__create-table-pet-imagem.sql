CREATE TABLE pet_imagens (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    imagem_url TEXT NOT NULL,
    CONSTRAINT fk_pet_imagens_pet
        FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);