package br.com.app.quero_pecas.entity;

import br.com.app.quero_pecas.utils.StatusUsuario;
import br.com.app.quero_pecas.utils.TipoUsuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(unique = true)
    private String cnpj;

    private String razaoSocial;
    private String nomeFantasia;
    private String representanteLegal;
    private String senha;
    private String email;
    private String motivoReprovacao;
    //TODO: necessario criar um atributo "Criado em" para a tela "admin-acesso.html"

    @Column(columnDefinition = "TINYINT DEFAULT 0")
    private boolean ativo;

    @OneToOne(cascade = CascadeType.ALL) @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true) @JoinColumn(name = "telefone_usuario_id")
    private List<Telefone> telefone;

    @OneToMany(mappedBy = "usuario")
    private List<Pedido> pedidos;

    @Enumerated(EnumType.STRING)
    private StatusUsuario status = StatusUsuario.PENDENTE;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;


}
