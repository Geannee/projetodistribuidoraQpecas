package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findAllByUsuarioIdUsuarioOrderByDataDesc(Long idUsuario);
}
