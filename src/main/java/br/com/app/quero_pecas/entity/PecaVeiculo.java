package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PecaVeiculo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pecaVeiculo;

    @ManyToOne @JoinColumn(name = "peca_id")
    private Peca peca;

    @ManyToOne @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;
}
