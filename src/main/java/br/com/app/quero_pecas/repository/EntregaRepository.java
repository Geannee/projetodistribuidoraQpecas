package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Entrega;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {
}
