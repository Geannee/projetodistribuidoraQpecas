package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PecaVeiculoRepository extends JpaRepository<PecaVeiculo, Long> {

    @Query("SELECT pv.peca FROM PecaVeiculo pv WHERE pv.veiculo.idVeiculo = :veiculoId")
    List<Peca> findPecasByVeiculoId(@Param("veiculoId") Long veiculoId);
}
