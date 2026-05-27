package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Year;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Veiculo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVeiculo;

    @Column(columnDefinition = "YEAR")
    private Year anoFabricacao;
    private String chassi;
    private String marca;
    private String modelo;
    private String placa;
}
