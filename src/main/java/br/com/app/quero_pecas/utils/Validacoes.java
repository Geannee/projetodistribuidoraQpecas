package br.com.app.quero_pecas.utils;

import br.com.caelum.stella.validation.CNPJValidator;
import lombok.NonNull;
import org.springframework.security.authentication.BadCredentialsException;

public class Validacoes {
    public static void validarEmail(@NonNull String email) {
        if (!email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new BadCredentialsException("Verifique se o campo está correto.");
        }
    }

    public static String validarCNPJ(String cnpj) {
        try {
            new CNPJValidator(false).assertValid(cnpj);
            return cnpj;
        } catch (Exception e) {
            throw new IllegalArgumentException("Verifique se o campo está correto.");
        }
    }
}
