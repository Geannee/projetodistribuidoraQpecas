package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCnpj(String cnpj);
    Optional<Usuario> findByEmail(String email);
    boolean existsByCnpj(String cnpj);
    boolean existsByEmail(String email);
}
