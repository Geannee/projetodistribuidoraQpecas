package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.Veiculo;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PecaRepository extends JpaRepository<Peca, Long> {
    boolean existsByCodigo(@NotBlank String codigo);
    List<Peca> findAllByAtivoTrue();
}
