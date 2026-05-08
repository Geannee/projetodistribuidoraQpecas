package br.com.app.quero_pecas.utils;

import br.com.caelum.stella.validation.CNPJValidator;
import lombok.NonNull;
import org.springframework.security.authentication.BadCredentialsException;

public class Validacoes {
    public void validarEmail(@NonNull String email) {
        if (!email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new BadCredentialsException("Formato de E-mail Invalido");
        }
    }

    public void validarCNPJ(String cnpj) {
        try {
            new CNPJValidator(false).assertValid(cnpj);
        } catch (Exception e) {
            throw new BadCredentialsException("O CNPJ não é válido");
        }
    }
}
