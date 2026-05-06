package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
}
