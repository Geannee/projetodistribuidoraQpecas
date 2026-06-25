package br.com.app.quero_pecas.dto;

import br.com.app.quero_pecas.utils.TipoPeca;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public final class PecaDTO {

    public record Save(
            @NotBlank String categoria,
            @NotBlank String codigo,
            @NotBlank String descricao,
            @NotNull @PositiveOrZero Integer estoque,
            @NotNull Long fabricanteId,
            @NotBlank String nome,
            @NotNull Double precoBase,

            @NotNull TipoPeca tipoPeca,

            @NotEmpty(message = "Selecione ao menos um veículo compatível")
            List<Long> veiculosIds
            ) {}
}
