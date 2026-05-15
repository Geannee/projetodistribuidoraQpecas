package br.com.app.quero_pecas.dto;

import br.com.app.quero_pecas.entity.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public interface UsuarioDTO {
    public record Save(
            @NotBlank @Size(max = 18, min = 14) String cnpj,
            @NotBlank String razaoSocial,
            @NotBlank String nomeFantasia,
            @NotBlank String representanteLegal,
            @NotBlank @Size(min = 8) String senha,
            @NotBlank @Email String email,
            TipoUsuario tipoUsuario,
            String motivoReprovacao,
            EnderecoCreate endereco, List<TelefoneCreate> telefone

    ) {}

    record EnderecoCreate(
            @NotBlank String cep,
            @NotBlank String logradouro,
            @NotNull int numero,
            @NotBlank String bairro,
            @NotBlank String cidade,
            @NotBlank String estado) {}

    record TelefoneCreate(
            @NotBlank String telefone,
            String tipo) {}
}