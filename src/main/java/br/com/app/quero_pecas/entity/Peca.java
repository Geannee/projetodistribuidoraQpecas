package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Peca {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPeca;

    private String descricao;
    private int estoque;
    private String marca;
    private String nome;
    private double precoBase;
    private String categoria;

    @Column(unique = true)
    private String codigo;

    @Enumerated(EnumType.STRING)
    private TipoPeca tipoPeca;

    @Column(columnDefinition = "TINYINT DEFAULT 1")
    private boolean ativo = true;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fabricante_id")
    private Fabricante fabricante;
}
