package br.com.app.quero_pecas.entity;

import br.com.app.quero_pecas.dto.PecaOrcamento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Orcamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrcamento;
    // Linha do Mecanico
    // TODO: O orçamento deve puxar email+nome,
    private LocalDateTime dataHora;
    // Linha cliente
    private String nomeCliente;
    private String emailCliente;
    private String telefoneCliente;
    private String enderecoCliente;
    // Linha de Produtos e Total

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "pecas", columnDefinition = "json")
    private List<PecaOrcamento> pecas;

    private Double valorTotal;
    // Linha de Detalhes
    private String detalhes;

    @ManyToOne
    @JoinColumn(name = "orcamento_usuario_id")
    private Usuario usuario;
}
