package br.com.app.quero_pecas.entity;

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

    @Column(columnDefinition = "TINYINT DEFAULT 0")
    private boolean ativo;

    @OneToOne(cascade = CascadeType.ALL) @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true) @JoinColumn(name = "usuario_id")
    private List<Telefone> telefone;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;


}
