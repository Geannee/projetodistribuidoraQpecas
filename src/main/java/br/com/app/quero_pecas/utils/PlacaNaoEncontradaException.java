package br.com.app.quero_pecas.utils;

public class PlacaNaoEncontradaException extends RuntimeException{
    public PlacaNaoEncontradaException(String mensagem) {
        super(mensagem);
    }
}
