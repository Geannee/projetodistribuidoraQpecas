package br.com.app.quero_pecas.dto;

import jakarta.validation.constraints.NotBlank;

public interface FabricanteDTO {
    public record Save(
            @NotBlank(message = "O CNPJ é obrigatório") String cnpj,
            @NotBlank(message = "O nome/razão social é obrigatório") String nome
    ) {}
}
