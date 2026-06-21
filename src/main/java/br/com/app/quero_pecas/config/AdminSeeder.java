package br.com.app.quero_pecas.config;

import br.com.app.quero_pecas.entity.StatusUsuario;
import br.com.app.quero_pecas.entity.TipoUsuario;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByEmail("admin@queropecas.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setEmail("admin@queropecas.com");
            admin.setSenha(passwordEncoder.encode("queropecas"));
            admin.setRepresentanteLegal("Administrador");
            admin.setRazaoSocial("Quero Pecas Distribuidora Ltda");
            admin.setNomeFantasia("Quero Pecas");
            admin.setCnpj("00000000000000");
            admin.setTipoUsuario(TipoUsuario.DISTRIBUIDOR);
            admin.setStatus(StatusUsuario.ATIVO);
            admin.setAtivo(true);
            usuarioRepository.save(admin);
            System.out.println("Default admin user created successfully: admin@queropecas.com / queropecas");
        }
    }
}
