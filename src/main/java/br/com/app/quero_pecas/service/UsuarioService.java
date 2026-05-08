package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.UsuarioDTO;
import br.com.app.quero_pecas.entity.Endereco;
import br.com.app.quero_pecas.entity.Telefone;
import br.com.app.quero_pecas.entity.TipoUsuario;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.app.quero_pecas.utils.Validacoes;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void save(UsuarioDTO.Save dados) {

        Validacoes.validarEmail(dados.email());
        Validacoes.validarCNPJ(dados.cnpj());

        Usuario usuario = new Usuario();
        usuario.setCnpj(dados.cnpj().replaceAll("\\D", ""));
        usuario.setRazaoSocial(dados.razaoSocial());
        usuario.setNomeFantasia(dados.nomeFantasia());
        usuario.setRepresentanteLegal(dados.representanteLegal());
        usuario.setTipoUsuario(TipoUsuario.MECANICO);

        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        usuario.setSenha(senhaCriptografada);

        usuario.setEmail(dados.email().toLowerCase());

        // 1. Convertendo EnderecoCreate (DTO) para Endereco (Entidade)
        if (dados.endereco() != null) {
            Endereco endereco = new Endereco();
            endereco.setCep(dados.endereco().cep());
            endereco.setLogradouro(dados.endereco().logradouro());
            endereco.setNumero(dados.endereco().numero());
            endereco.setBairro(dados.endereco().bairro());
            endereco.setCidade(dados.endereco().cidade());
            endereco.setEstado(dados.endereco().estado());

            usuario.setEndereco(endereco);
        }

        // 2. Convertendo List<TelefoneCreate> (DTO) para List<Telefone> (Entidade)
        if (dados.telefone() != null) {
            List<Telefone> telefones = dados.telefone().stream().map(telDto -> {
                Telefone tel = new Telefone();
                tel.setTelefone(telDto.telefone());
                tel.setTipo(telDto.tipo());
                return tel;
            }).collect(Collectors.toList());

            usuario.setTelefone(telefones);
        }
        usuarioRepository.save(usuario);
    }
}