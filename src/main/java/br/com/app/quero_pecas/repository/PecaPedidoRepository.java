package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.PecaPedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PecaPedidoRepository extends JpaRepository<PecaPedido, Long> {
}
