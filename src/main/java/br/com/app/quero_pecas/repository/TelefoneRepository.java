package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.Telefone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TelefoneRepository extends JpaRepository<Telefone, Long> {
}
