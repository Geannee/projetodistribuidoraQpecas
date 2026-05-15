package br.com.app.quero_pecas.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PlacaNaoEncontradaException extends RuntimeException {
    public PlacaNaoEncontradaException(String mensagem) {
        super(mensagem);
    }
}
