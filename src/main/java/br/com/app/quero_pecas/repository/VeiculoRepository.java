package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    boolean existsByChassiAndAtivoTrue(String chassi);
    boolean existsByPlacaAndAtivoTrue(String placa);
    List<Veiculo> findAllByAtivoTrue();
}
