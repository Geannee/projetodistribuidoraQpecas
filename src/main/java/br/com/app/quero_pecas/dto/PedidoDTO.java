package br.com.app.quero_pecas.dto;

import br.com.app.quero_pecas.utils.StatusPedido;

import java.time.LocalDateTime;
import java.util.List;

public final class PedidoDTO {

    private PedidoDTO() {
    }

    public record PedidoRequest(
            Long idUsuario,
            Double valorFrete,
            EnderecoEntregaRequest enderecoEntrega,
            List<ItemPedidoRequest> itens
    ) {
    }

    public record ItemPedidoRequest(
            Long idPeca,
            Integer quantidade
    ) {
    }

    public record PedidoResponse(
            Long idPedido,
            String numeroPedido,
            LocalDateTime data,
            StatusPedido status,
            Double valorFrete,
            Double valorTotal,
            Long idEntrega,
            List<ItemPedidoResponse> itens,
            String nomeCliente,
            String cnpjCliente,
            String motivoCancelamento
    ) {
    }

    public record ItemPedidoResponse(
            Long idPeca,
            String nomePeca,
            Integer quantidade,
            Double precoVenda,
            Double subtotal
    ) {
    }

    public record AtualizarPagamentoRequest(
            String metodoPagamento,
            String statusPagamento
    ) {
    }

    public record EnderecoEntregaRequest(
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidadeUf
    ) {
    }
}
