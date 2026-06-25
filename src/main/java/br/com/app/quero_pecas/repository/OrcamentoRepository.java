package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByUsuarioIdUsuario(Long idUsuario);
}
