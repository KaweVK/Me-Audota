package kawe.vk.me_audota.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class PetImagemService {
    private final Cloudinary cloudinary;

    public PetImagemService(@Value("${CLOUDINARY_URL}") String cloudinaryUrl) {
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    public String uploadImagem(MultipartFile arquivo) {
        try {
            Map resultado = cloudinary.uploader().upload(arquivo.getBytes(), ObjectUtils.emptyMap());
            return (String) resultado.get("url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Image error");
        }
    }

    public List<String> uploadImagens(List<MultipartFile> imagens) {
        if (imagens == null || imagens.isEmpty()) {
            return Collections.emptyList();
        }

        return imagens.stream()
                .filter(imagem -> imagem != null && !imagem.isEmpty())
                .map(this::uploadImagem)
                .toList();
    }
}
