package br.com.app.quero_pecas.entity;

import br.com.app.quero_pecas.utils.StatusPedido;
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

    @Column(unique = true)
    private String numeroPedido;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    private Double valorFrete;
    private Double valorTotal;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "entrega_id")
    private Entrega entrega;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PecaPedido> itens;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Pagamento pagamento;

    private String motivoCancelamento;
}
