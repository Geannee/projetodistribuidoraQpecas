package br.com.app.quero_pecas.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class PecaOrcamento {
    private Long idPeca;
    private String nome;
    private String codigo;
    private Double precoCobrado;
    private Integer quantidade;
}
