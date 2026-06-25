package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.OrcamentoDTO;
import br.com.app.quero_pecas.dto.PecaOrcamento;
import br.com.app.quero_pecas.entity.Orcamento;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.OrcamentoRepository;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class OrcamentoService {
    @Autowired
    private OrcamentoRepository orcamentoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PecaRepository pecaRepository;

    public OrcamentoDTO.OrcamentoResponse save(OrcamentoDTO.OrcamentoRequest dados) {
        Orcamento orcamento = new Orcamento();
        orcamento.setDataHora(LocalDateTime.now());
        orcamento.setNomeCliente(dados.nomeCliente());
        orcamento.setEmailCliente(dados.emailCliente());
        orcamento.setTelefoneCliente(dados.telefoneCliente());
        orcamento.setEnderecoCliente(dados.enderecoCliente());
        orcamento.setDetalhes(dados.detalhes());

        List<PecaOrcamento> pecasDoOrcamento = dados.itens().stream().map(item -> {
            Peca pecaDoBanco = pecaRepository.findById(item.idPeca())
                    .orElseThrow(() -> new RuntimeException("Peça não encontrada! ID: " + item.idPeca()));

            PecaOrcamento po = new PecaOrcamento();
            po.setIdPeca(pecaDoBanco.getIdPeca());
            po.setNome(pecaDoBanco.getNome());
            po.setCodigo(pecaDoBanco.getCodigo());
            po.setQuantidade(item.quantidade());
            po.setPrecoCobrado(pecaDoBanco.getPreco());
            return po;
        }).toList();

        Double valorTotal = 0.0;
        for (PecaOrcamento po : pecasDoOrcamento) {
            if (po.getPrecoCobrado() != null && po.getQuantidade() != null) {
                valorTotal += po.getPrecoCobrado() * po.getQuantidade();
            }
        }

        orcamento.setPecas(pecasDoOrcamento);
        orcamento.setValorTotal(valorTotal);

        if (dados.idUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(dados.idUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + dados.idUsuario()));
            orcamento.setUsuario(usuario);
        }

        Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);

        return new OrcamentoDTO.OrcamentoResponse(
                orcamentoSalvo.getIdOrcamento(),
                orcamentoSalvo.getDataHora(),
                orcamentoSalvo.getDetalhes(),
                orcamentoSalvo.getEmailCliente(),
                orcamentoSalvo.getEnderecoCliente(),
                orcamentoSalvo.getNomeCliente(),
                orcamentoSalvo.getPecas(),
                orcamentoSalvo.getValorTotal()
        );
    }

    public List<OrcamentoDTO.OrcamentoResponse> findAll() {
        // 1. Pega a Autenticação da sessão com segurança
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não está autenticado na sessão.");
        }

        // 2. Extrai o e-mail (que está vindo como String no Principal)
        String emailLogado = authentication.getName();

        // 3. Busca o usuário completo no banco usando o e-mail da sessão
        Usuario usuarioLogado = usuarioRepository.findByEmail(emailLogado)
                .orElseThrow(() -> new RuntimeException("Usuário logado com o e-mail " + emailLogado + " não foi encontrado no banco."));

        // 4. Busca os orçamentos filtrando pelo ID do usuário encontrado
        List<Orcamento> orcamentos = orcamentoRepository.findByUsuarioIdUsuario(usuarioLogado.getIdUsuario());

        // 5. Converte a lista de Entidades para a lista de DTO (Response)
        return orcamentos.stream().map(orcamento -> new OrcamentoDTO.OrcamentoResponse(
                orcamento.getIdOrcamento(),
                orcamento.getDataHora(),
                orcamento.getDetalhes(),
                orcamento.getEmailCliente(),
                orcamento.getEnderecoCliente(),
                orcamento.getNomeCliente(),
                orcamento.getPecas(),
                orcamento.getValorTotal()
        )).toList();
    }
}

