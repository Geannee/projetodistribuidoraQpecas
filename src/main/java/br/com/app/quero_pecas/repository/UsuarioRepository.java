package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByCnpj(@NotBlank @Size(max = 14, min = 14) String cnpj);
}
