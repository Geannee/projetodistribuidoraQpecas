package br.com.app.quero_pecas.dto;

import br.com.app.quero_pecas.utils.TipoDeCombustivel;
import jakarta.validation.constraints.NotBlank;

import java.time.Year;

public final class VeiculoDTO {

    public record Save(
            @NotBlank Year anoFabricacao,
            @NotBlank String marca,
            @NotBlank String modelo,
            @NotBlank String chassi,
            @NotBlank String placa,
            String observacoes,
            @NotBlank TipoDeCombustivel tipoDeCombustivel
    ) {}
}
