package br.com.app.quero_pecas.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {

    // ── O RESUMO AGORA CARREGA OS ITENS SIMPLIFICADOS ──────────────────
    public record Resumo(
            Long idPedido,
            String numeroPedido,
            LocalDateTime data,
            String status,
            float valorTotal,
            List<ItemResumo> itens // <── Nova lista adicionada aqui
    ) {}

    // Record auxiliar para não pesar o histórico principal
    public record ItemResumo(
            String nomePeca,
            int quantidade
    ) {}

    // ── DETALHE (Continua igual para o seu Modal) ──────────────────────
    public record Detalhe(
            Long idPedido,
            String numeroPedido,
            LocalDateTime data,
            String status,
            float valorFrete,
            float valorTotal,
            String nomeComprador,
            List<ItemDetalhe> itens
    ) {}

    public record ItemDetalhe(
            Long idPeca,
            String nomePeca,
            String sku,
            int quantidade,
            float precoVenda,
            float subtotal
    ) {}
}