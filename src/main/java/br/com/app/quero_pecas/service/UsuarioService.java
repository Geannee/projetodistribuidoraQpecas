package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.UsuarioDTO;
import br.com.app.quero_pecas.entity.Endereco;
import br.com.app.quero_pecas.entity.StatusUsuario;
import br.com.app.quero_pecas.entity.Telefone;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void save(UsuarioDTO.Save dados) {
        Usuario usuario = new Usuario();
        usuario.setCnpj(dados.cnpj());
        usuario.setRazaoSocial(dados.razaoSocial());
        usuario.setNomeFantasia(dados.nomeFantasia());
        usuario.setRepresentanteLegal(dados.representanteLegal());
        usuario.setSenha(dados.senha());
        usuario.setEmail(dados.email());
        usuario.setTipoUsuario(dados.tipoUsuario());
        usuario.setMotivoReprovacao(dados.motivoReprovacao());

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

    public List<Usuario> listarPendentes() {
        return usuarioRepository.findByStatus(StatusUsuario.PENDENTE);
    }

    public List<Usuario> listarReprovados() {
        return usuarioRepository.findByStatus(StatusUsuario.REPROVADO);
    }

    public List<Usuario> listarAtivos() {
        return usuarioRepository.findByStatus(StatusUsuario.ATIVO);
    }

    @Transactional
    public void aprovarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setAtivo(true);

        usuario.setStatus(StatusUsuario.ATIVO);
        usuarioRepository.save(usuario);

        // TODO: dispararEmailComCredenciais(usuario.getEmail());
    }

    @Transactional
    public void reprovarUsuario(Long id, String motivo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setStatus(StatusUsuario.REPROVADO);
        usuario.setAtivo(false);
        usuario.setMotivoReprovacao(motivo);

        usuarioRepository.save(usuario);

        // TODO: notificarSolicitanteReprovacao(usuario.getEmail(), motivo);
    }

}