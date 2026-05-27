package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
   Optional<Veiculo> findByPlaca(String placa);
}
