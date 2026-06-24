package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.UsuarioDTO;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.app.quero_pecas.utils.StatusUsuario;
import br.com.app.quero_pecas.utils.TipoUsuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    @DisplayName("Deve salvar usuário com sucesso quando os dados forem válidos")

    void deveSalvarUsuarioComSucesso() {
        // Arrange: Dados válidos (CNPJ matematicamente válido para passar no Caelum Stella)
        UsuarioDTO.EnderecoCreate enderecoFake = new UsuarioDTO.EnderecoCreate(
                "12345678", "Rua Teste", "1", "Bairro", "Cidade", "SP"
        );

        UsuarioDTO.Save dto = new UsuarioDTO.Save(
                "20402686000154", "Mecânica Silva", "Auto Peças Silva", "João Silva",
                "senha123", "joao@email.com", TipoUsuario.MECANICO, "12345", enderecoFake, new ArrayList<>()
        );

        when(usuarioRepository.existsByCnpj(anyString())).thenReturn(false);
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("$2a$10$HashSimuladoAqui");

        // Act
        usuarioService.save(dto);

        // Assert: Captura o objeto que foi enviado para o Repository.save()
        ArgumentCaptor<Usuario> usuarioCaptor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository, times(1)).save(usuarioCaptor.capture());

        Usuario usuarioSalvo = usuarioCaptor.getValue();

        assertEquals(TipoUsuario.MECANICO, usuarioSalvo.getTipoUsuario());
        assertEquals("$2a$10$HashSimuladoAqui", usuarioSalvo.getSenha());
        assertEquals("joao@email.com", usuarioSalvo.getEmail());
        assertEquals("20402686000154", usuarioSalvo.getCnpj());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar salvar CNPJ já cadastrado")
    void naoDeveSalvarCnpjDuplicado() {
        // Arrange
        UsuarioDTO.EnderecoCreate enderecoFake = new UsuarioDTO.EnderecoCreate(
                "12345678", "Rua Teste", "1", "Bairro", "Cidade", "SP"
        );

        UsuarioDTO.Save dto = new UsuarioDTO.Save(
                "37805121000109", "Mecânica Silva", "Auto Peças Silva", "João Silva",
                "senha123", "joao@email.com", null, "", enderecoFake, new ArrayList<>()
        );

        when(usuarioRepository.existsByCnpj(anyString())).thenReturn(true); // Simula que já existe

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.save(dto);
        });

        assertEquals("CNPJ já cadastrado no sistema.", exception.getMessage());
        verify(usuarioRepository, never()).save(any(Usuario.class)); // Garante que NUNCA chamou o save
    }

    @Test
    @DisplayName("Deve falhar ao passar um CNPJ com formato inválido (Caelum Stella)")
    void naoDeveSalvarComCnpjInvalido() {
        UsuarioDTO.EnderecoCreate enderecoFake = new UsuarioDTO.EnderecoCreate(
                "12345678", "Rua Teste", "1", "Bairro", "Cidade", "SP"
        );
        // Arrange: CNPJ com números repetidos (matematicamente inválido)
        UsuarioDTO.Save dto = new UsuarioDTO.Save(
                "11111111111111", "Mecânica Silva", "Auto Peças Silva", "João Silva",
                "senha123", "joao@email.com", null, "", enderecoFake, new ArrayList<>()
        );

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.save(dto);
        });

        assertEquals("Formato de CNPJ invalido.", exception.getMessage()); // Mensagem que você definiu no Validacoes
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve ativar um usuário com sucesso")
    void aprovarUsuario_Sucesso() {
        // Arrange
        Long idTeste = 1L;
        Usuario usuario = new Usuario();
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
        usuario.setStatus(StatusUsuario.PENDENTE);

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