package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
