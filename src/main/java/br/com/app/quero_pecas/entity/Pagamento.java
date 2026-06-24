package br.com.app.quero_pecas.entity;

import br.com.app.quero_pecas.utils.MetodoPagamento;
import br.com.app.quero_pecas.utils.StatusPagamento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Pagamento {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPagamento;

    private LocalDateTime dataPagamento;

    @Enumerated(EnumType.STRING)
    private MetodoPagamento metodoPagamento;

    @Enumerated(EnumType.STRING)
    private StatusPagamento statusPagamento;

    @OneToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
}
