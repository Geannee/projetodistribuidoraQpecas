package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Peca;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PecaRepository extends JpaRepository<Peca, Long> {
    boolean existsByCodigo(@NotBlank String codigo);
    //
}
