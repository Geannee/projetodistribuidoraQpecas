package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Peca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PecaRepository extends JpaRepository<Peca, Long> {
    @Query(value = """
        SELECT DISTINCT p.* FROM peca p
        INNER JOIN peca_veiculo pv ON p.id_peca = pv.peca_id
        INNER JOIN veiculo v ON pv.veiculo_id = v.id_veiculo
        WHERE (:marca IS NULL OR v.marca = :marca)
          AND (:modelo IS NULL OR v.modelo = :modelo)
          AND (:ano IS NULL OR v.ano_fabricacao = :ano)
          AND (:categoria IS NULL OR p.categoria = :categoria)
        """, nativeQuery = true)
    //TODO: adicioonar as novamente a  verificação onte peca e carro são ativos
    //AND p.ativo = true
    //AND v.ativo = true

    List<Peca> buscarPorAplicacao(
            @Param("marca") String marca,
            @Param("modelo") String modelo,
            @Param("ano") Integer ano,
            @Param("categoria") String categoria
    );

}

