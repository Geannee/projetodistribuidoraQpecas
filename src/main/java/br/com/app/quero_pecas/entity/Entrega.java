package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Entrega {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntrega;
    private String prazo;
    private String status;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destino_endereco_id")
    private Endereco endereco;

}
