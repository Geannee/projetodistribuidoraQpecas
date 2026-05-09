package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.AuthDTO;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.caelum.stella.validation.CNPJValidator;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

import static br.com.app.quero_pecas.utils.Validacoes.validarCNPJ;
import static br.com.app.quero_pecas.utils.Validacoes.validarEmail;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;

    private static final String MSG_ERRO_AUTH = "Login ou Senha inválidos";

    public AuthDTO.Response auth(@Valid AuthDTO.Request data) {
        String login = data.login().trim();
        boolean isEmail = login.contains("@");

        Usuario usuario = buscarEValidar(login, isEmail);

        if (!passwordEncoder.matches(data.senha(), usuario.getSenha())) {
            throw new BadCredentialsException(MSG_ERRO_AUTH);
        }

        String token = tokenService.gerarToken(usuario);

        return new AuthDTO.Response(
                usuario.getIdUsuario(),
                usuario.getCnpj(),
                usuario.getEmail(),
                usuario.getRepresentanteLegal(),
                usuario.getTipoUsuario(),
                token
        );
    }

    private Usuario buscarEValidar(String login, boolean isEmail) {
        try {
            if (isEmail) {
                validarEmail(login);
                return repository.findByEmail(login.toLowerCase())
                        .orElseThrow(NoSuchElementException::new);
            } else {
                validarCNPJ(login);
                return repository.findByCnpj(login.replaceAll("\\D", ""))
                        .orElseThrow(NoSuchElementException::new);
            }
        } catch (Exception e) {
            throw new BadCredentialsException(MSG_ERRO_AUTH);
        }
    }
}
