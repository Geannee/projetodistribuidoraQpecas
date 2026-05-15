package br.com.app.quero_pecas;

import br.com.app.quero_pecas.dto.UsuarioDTO;
import br.com.app.quero_pecas.entity.StatusUsuario;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.app.quero_pecas.service.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static br.com.app.quero_pecas.entity.StatusUsuario.PENDENTE;
import static br.com.app.quero_pecas.entity.TipoUsuario.MECANICO;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @InjectMocks
    private UsuarioService usuarioService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Deve salvar um usuário corretamente convertendo DTO para Entidade")
    void save_Sucesso() {
        var enderecoDto = new UsuarioDTO.EnderecoCreate("12345678", "Rua A", 10, "Centro", "Cidade", "ST");
        var telefoneDto = new UsuarioDTO.TelefoneCreate("11999999999", "CELULAR");

        var request = new UsuarioDTO.Save("15436940000103", "Razao Social Ltda", "Nome Fantasia", "Representante", "senha123", "teste@email.com", MECANICO, "", enderecoDto, List.of(telefoneDto));

        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$HashSimuladoAqui");

        usuarioService.save(request);

        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        Usuario usuarioSalvo = usuarioCaptor.getValue();

        assertEquals(request.cnpj(), usuarioSalvo.getCnpj());
        assertEquals(request.email(), usuarioSalvo.getEmail());
        assertEquals("$2a$10$HashSimuladoAqui", usuarioSalvo.getSenha());
        assertNotNull(usuarioSalvo.getEndereco());
        assertEquals("Rua A", usuarioSalvo.getEndereco().getLogradouro());
        assertEquals(1, usuarioSalvo.getTelefone().size());
    }

    @Test
    @DisplayName("Deve ativar um usuário com sucesso")
    void aprovarUsuario_Sucesso() {
        Long idTeste = 1L;
        Usuario usuario = new Usuario();
        usuario.setAtivo(false);

        when(usuarioRepository.findById(idTeste)).thenReturn(Optional.of(usuario));

        usuarioService.aprovarUsuario(idTeste);

        assertTrue(usuario.isAtivo());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    @DisplayName("Deve desativar o usuário, mudar status para REPROVADO e salvar o motivo")
    void reprovarUsuario_Sucesso() {
        Long idTeste = 1L;
        String motivoTeste = "Documentação ilegível";

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(idTeste);
        usuario.setAtivo(true);
        usuario.setStatus(PENDENTE);

        when(usuarioRepository.findById(idTeste)).thenReturn(Optional.of(usuario));

        usuarioService.reprovarUsuario(idTeste, motivoTeste);

        assertFalse(usuario.isAtivo(), "O usuário deveria estar desativado");
        assertEquals(StatusUsuario.REPROVADO, usuario.getStatus(), "O status deveria ser REPROVADO");
        assertEquals(motivoTeste, usuario.getMotivoReprovacao(), "O motivo gravado deve ser igual ao enviado");

        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar aprovar usuário inexistente")
    void aprovarUsuario_Erro() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> usuarioService.aprovarUsuario(99L));
        verify(usuarioRepository, never()).save(any());
    }
}