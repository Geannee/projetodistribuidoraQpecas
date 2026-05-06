package br.com.app.quero_pecas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public interface AuthDTO {
    public record Request(
      @NotBlank(message = "Preencha o campo com um E-mail ou CNPJ!")
      String login,
      @NotBlank(message = "A senha é obrigatoria!") @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
      String senha
    ){}

    public record Response(
            Long id,
            String cnpj,
            String email,
            String nome,
            String token
    ) {}
}
