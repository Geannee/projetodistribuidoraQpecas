package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;
    private LocalDateTime data;
    private String numeroPedido;
    private String status;
    private float valorFrete;
    private float valorTotal;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "entrega_id")
    private Entrega entrega;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<PecaPedido> itens;
}
