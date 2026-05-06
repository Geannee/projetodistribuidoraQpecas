package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
