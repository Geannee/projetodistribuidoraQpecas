package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PecaPedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPecaPedido;
    private float precoVenda;
    private int quantidade;

    @ManyToOne @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    @ManyToOne @JoinColumn(name = "peca_id")
    private Peca peca;
}
