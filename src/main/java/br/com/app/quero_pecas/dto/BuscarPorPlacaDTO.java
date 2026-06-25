package br.com.app.quero_pecas.dto;

import java.util.List;

public final class BuscarPorPlacaDTO {
    public record BuscarPlacaResponseDTO(
            VeiculoDTO veiculo,
            List<PecaResponse> pecas
    ) {}

    public record PecaResponse(
            Long id,
            String nome,
            String descricao,
            Double precoBase,
            Integer estoque,
            String marca,
            String categoria
    ) {}

    public record VeiculoDTO(
            Long id,
            String placa,
            String marca,
            String modelo,
            String ano
    ) {}
}
