package br.com.app.quero_pecas.dto;

import br.com.app.quero_pecas.utils.StatusPedido;

import java.time.LocalDateTime;
import java.util.List;

public interface PedidoDTO {
    record PedidoRequest(
            Long idUsuario,
            Double valorFrete,
            EnderecoEntregaRequest enderecoEntrega,
            List<ItemPedidoRequest> itens
    ) {
    }

    record ItemPedidoRequest(
            Long idPeca,
            Integer quantidade
    ) {
    }

    record PedidoResponse(
            Long idPedido,
            String numeroPedido,
            LocalDateTime data,
            StatusPedido status,
            Double valorFrete,
            Double valorTotal,
            Long idEntrega,
            List<ItemPedidoResponse> itens
    ) {
    }

    record ItemPedidoResponse(
            Long idPeca,
            String nomePeca,
            Integer quantidade,
            Double precoVenda,
            Double subtotal
    ) {
    }

    record AtualizarPagamentoRequest(
            String metodoPagamento,
            String statusPagamento
    ) {
    }

    record EnderecoEntregaRequest(
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidadeUf
    ) {
    }
}
