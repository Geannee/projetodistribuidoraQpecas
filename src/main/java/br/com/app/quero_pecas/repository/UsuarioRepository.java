package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.StatusUsuario;
import br.com.app.quero_pecas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByStatus(StatusUsuario status);
}
