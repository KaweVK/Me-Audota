package kawe.vk.me_audota.service;

import kawe.vk.me_audota.dto.RegisterUsuarioDTO;
import kawe.vk.me_audota.dto.ResponseUsuarioDTO;
import kawe.vk.me_audota.mapper.UsuarioMapper;
import kawe.vk.me_audota.model.Usuario;
import kawe.vk.me_audota.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    public Optional<ResponseUsuarioDTO> findById(Long id) {
        var usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return usuario.map(usuarioMapper::toResponseDTO);
        } else {
            throw new IllegalArgumentException("Usuário com ID " + id + " não existe");
        }
    }

    public Page<ResponseUsuarioDTO> findAll(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Usuario> result = usuarioRepository.findAll(pageable);
        return result.map(usuarioMapper::toResponseDTO);
    }

    public Optional<Usuario> create(RegisterUsuarioDTO registerUsuarioDTO) {
        var usuario = usuarioMapper.toEntity(registerUsuarioDTO);
        //adicionar validate
        usuario.setSenha(passwordEncoder.encode(usuario.getPassword()));
        return Optional.of(usuarioRepository.save(usuario));
    }

    public Optional<ResponseUsuarioDTO> update(Long id, RegisterUsuarioDTO registerUsuarioDTO) {
        var usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            Usuario usuarioToUpdate = usuario.get();
            usuarioToUpdate.setNome(registerUsuarioDTO.nome());
            usuarioToUpdate.setEmail(registerUsuarioDTO.email());
            usuarioToUpdate.setSenha(passwordEncoder.encode(registerUsuarioDTO.senha()));
            usuarioToUpdate.setTelefone(registerUsuarioDTO.telefone());

            Usuario usuarioUpdated = usuarioRepository.save(usuarioToUpdate);
            return Optional.of(usuarioMapper.toResponseDTO(usuarioUpdated));
        } else {
            throw new IllegalArgumentException("Usuário com ID " + id + " não existe");
        }
    }

    public void delete(Long id) {
        var usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            usuarioRepository.delete(usuario.get());
        } else {
            throw new IllegalArgumentException("Usuário com ID " + id + " não existe");
        }
    }

}