package br.com.app.quero_pecas.entity;

import br.com.app.quero_pecas.utils.TipoPeca;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Peca {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPeca;
    private String codigo;
    private String descricao;
    private int estoque;
    private String marca;
    private String nome;
    private String categoria;
    private double preco;
    private TipoPeca tipoPeca;
    private boolean ativo;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fabricante_id")
    private Fabricante fabricante;
}
