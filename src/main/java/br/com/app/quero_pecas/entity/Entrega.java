package br.com.app.quero_pecas.entity;

import br.com.app.quero_pecas.utils.StatusEntrega;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntrega;

    @Column(unique = true)
    private String codigoRastreio;

    @Enumerated(EnumType.STRING)
    private StatusEntrega statusEntrega;

    private LocalDate previsaoEntrega;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToOne(mappedBy = "entrega")
    private Pedido pedido;
}
