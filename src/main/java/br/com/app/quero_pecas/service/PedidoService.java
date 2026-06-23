package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.PedidoDTO;
import br.com.app.quero_pecas.entity.Pedido;
import br.com.app.quero_pecas.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Retorna a lista resumida para a tabela do Front-end
    public List<PedidoDTO.Resumo> listarHistoricoUsuario(Long idUsuario) {
        return pedidoRepository.findAllByUsuarioIdUsuarioOrderByDataDesc(idUsuario)
                .stream()
                .map(p -> {
                    // Mapeia os itens do pedido original para o DTO simplificado
                    List<PedidoDTO.ItemResumo> itensSimplificados = p.getItens().stream()
                            .map(item -> new PedidoDTO.ItemResumo(
                                    item.getPeca().getNome(),
                                    item.getQuantidade(),
                                    item.getPrecoVenda()
                            ))
                            .toList();

                    // Retorna o Resumo completo com a lista de itens inclusa
                    return new PedidoDTO.Resumo(
                            p.getIdPedido(),
                            p.getNumeroPedido(),
                            p.getData(),
                            p.getStatus(),
                            p.getValorTotal(),
                            itensSimplificados // <── Passando a lista preenchida
                    );
                })
                .toList();
    }

    // Retorna os detalhes completos de um pedido específico para o Pop-up
    public PedidoDTO.Detalhe buscarDetalhes(Long idPedido) {
        Pedido p = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        List<PedidoDTO.ItemDetalhe> itensDetalhe = p.getItens().stream()
                .map(item -> new PedidoDTO.ItemDetalhe(
                        item.getPeca().getIdPeca(), // Certifique-se do nome do ID na sua classe Peca
                        item.getPeca().getNome(),
                        item.getPeca().getCodigo(),
                        item.getQuantidade(),
                        item.getPrecoVenda(),
                        (item.getQuantidade() * item.getPrecoVenda())
                ))
                .toList();

        return new PedidoDTO.Detalhe(
                p.getIdPedido(),
                p.getNumeroPedido(),
                p.getData(),
                p.getStatus(),
                p.getValorFrete(),
                p.getValorTotal(),
                p.getUsuario().getNomeFantasia(), // Ou getRazaoSocial()
                itensDetalhe
        );
    }
}