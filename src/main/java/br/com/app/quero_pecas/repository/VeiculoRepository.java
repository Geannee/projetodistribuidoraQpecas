package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
}
