package br.com.app.quero_pecas.dto;

import java.time.LocalDateTime;
import java.util.List;

public final class OrcamentoDTO {

    public record OrcamentoRequest(
            String nomeCliente,
            String emailCliente,
            String telefoneCliente,
            String enderecoCliente,
            List<ListaItensRequest> itens,
            Double valorTotal,
            String detalhes,
            Long idUsuario
    ){}
    public record ListaItensRequest(
            Long idPeca,
            Integer quantidade
    ){}

    public record OrcamentoResponse(
            Long idOrcamento,
            LocalDateTime dataHora,
            String detalhes,
            String emailCliente,
            String enderecoCliente,
            String nomeCliente,
            List<PecaOrcamento> pecas,
            Double valorTotal
    ){}
}