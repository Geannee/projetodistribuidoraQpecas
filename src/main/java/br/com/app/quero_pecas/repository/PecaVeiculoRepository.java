package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PecaVeiculoRepository extends JpaRepository<PecaVeiculo, Long> {

    @Query("SELECT pv.peca FROM PecaVeiculo pv WHERE pv.veiculo.idVeiculo = :veiculoId")
    List<Peca> findPecasByVeiculoId(@Param("veiculoId") Long veiculoId);

    @Query("SELECT pv FROM PecaVeiculo pv WHERE pv.peca.ativo = true AND pv.veiculo.ativo = true")
    List<PecaVeiculo> findAllActivePairings();

    @Modifying
    @Transactional
    @Query("DELETE FROM PecaVeiculo pv WHERE pv.peca.idPeca = :pecaId")
    void deleteByPecaId(@Param("pecaId") Long pecaId);
}
