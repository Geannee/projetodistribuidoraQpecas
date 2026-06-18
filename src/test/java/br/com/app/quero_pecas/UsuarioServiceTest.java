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

    @Test
    @DisplayName("Deve salvar um usuário corretamente convertendo DTO para Entidade")
    void save_Sucesso() {
        // Arrange (Preparação)
        var enderecoDto = new UsuarioDTO.EnderecoCreate("12345678", "Rua A", 10, "Centro", "Cidade", "ST");
        var telefoneDto = new UsuarioDTO.TelefoneCreate("11999999999", "CELULAR");
        
        var request = new UsuarioDTO.Save(
                "15436940000103", "Razao Social Ltda", "Nome Fantasia", 
                "Representante", "senha123", "teste@email.com", 
                MECANICO, "",enderecoDto, List.of(telefoneDto)
        );

        // Act (Ação)
        usuarioService.save(request);

        // Assert (Verificação)
        // Usamos um ArgumentCaptor para "pegar" o objeto que foi passado para o repository.save()
        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioCaptor.capture());

        Usuario usuarioSalvo = usuarioCaptor.getValue();

        assertEquals(request.cnpj(), usuarioSalvo.getCnpj());
        assertEquals(request.email(), usuarioSalvo.getEmail());
        assertNotNull(usuarioSalvo.getEndereco());
        assertEquals("Rua A", usuarioSalvo.getEndereco().getLogradouro());
        assertEquals(1, usuarioSalvo.getTelefone().size());
    }

    @Test
    @DisplayName("Deve ativar um usuário com sucesso")
    void aprovarUsuario_Sucesso() {
        // Arrange
        Long idTeste = 1L;
        Usuario usuario = new Usuario();
//        usuario.setId(idTeste);
        usuario.setAtivo(false);

        when(usuarioRepository.findById(idTeste)).thenReturn(Optional.of(usuario));

        // Act
        usuarioService.aprovarUsuario(idTeste);

        // Assert
        assertTrue(usuario.isAtivo());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    @DisplayName("Deve desativar o usuário, mudar status para REPROVADO e salvar o motivo")
    void reprovarUsuario_Sucesso() {
        // Arrange (Preparação)
        Long idTeste = 1L;
        String motivoTeste = "Documentação ilegível";

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(idTeste);
        usuario.setAtivo(true);
        usuario.setStatus(PENDENTE);

        when(usuarioRepository.findById(idTeste)).thenReturn(Optional.of(usuario));

        // Act (Ação)
        usuarioService.reprovarUsuario(idTeste, motivoTeste);

        // Assert (Verificação)
        assertFalse(usuario.isAtivo(), "O usuário deveria estar desativado");
        assertEquals(StatusUsuario.REPROVADO, usuario.getStatus(), "O status deveria ser REPROVADO");
        assertEquals(motivoTeste, usuario.getMotivoReprovacao(), "O motivo gravado deve ser igual ao enviado");

        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar aprovar usuário inexistente")
    void aprovarUsuario_Erro() {
        // Arrange
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> usuarioService.aprovarUsuario(99L));
        verify(usuarioRepository, never()).save(any());
    }
}