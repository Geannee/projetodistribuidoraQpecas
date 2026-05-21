package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Year;
import java.util.List;
import java.util.Optional;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
   Optional<Veiculo> findByPlaca(String placa);

   @Query("SELECT DISTINCT v.modelo FROM Veiculo v WHERE LOWER(v.marca) = LOWER(:marca) ORDER BY v.modelo")
   List<String> findDistinctModelosByMarca(@Param("marca") String marca);

   @Query("SELECT DISTINCT v.anoFabricacao FROM Veiculo v WHERE LOWER(v.modelo) = LOWER(:modelo) ORDER BY v.anoFabricacao")
   List<Year> findDistinctAnoFabricacaoByModelo(@Param("modelo") String modelo);
}
