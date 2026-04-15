package kawe.vk.me_audota.service;

import kawe.vk.me_audota.dto.RegisterUsuarioDTO;
import kawe.vk.me_audota.dto.ResponseUsuarioDTO;
import kawe.vk.me_audota.mapper.UsuarioMapper;
import kawe.vk.me_audota.model.Usuario;
import kawe.vk.me_audota.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    public ResponseUsuarioDTO findById(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toResponseDTO)
                .orElseThrow(() -> new NoSuchElementException("Usuário com ID " + id + " não existe"));
    }

    public Page<ResponseUsuarioDTO> findAll(int page, int size) {
        return usuarioRepository.findAll(PageRequest.of(page, size))
                .map(usuarioMapper::toResponseDTO);
    }

    public ResponseUsuarioDTO create(RegisterUsuarioDTO dto) {
        Usuario usuario = usuarioMapper.toEntity(dto);
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        return usuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public ResponseUsuarioDTO update(Long id, RegisterUsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário com ID " + id + " não existe"));

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setTelefone(dto.telefone());

        return usuarioMapper.toResponseDTO(usuarioRepository.save(usuario));
    }

    public void delete(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário com ID " + id + " não existe"));
        usuarioRepository.delete(usuario);
    }
}