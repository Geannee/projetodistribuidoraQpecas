package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.UsuarioDTO;
import br.com.app.quero_pecas.entity.TipoUsuario;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

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
        UsuarioDTO.Save dto = new UsuarioDTO.Save(
                "20402686000154", "Mecânica Silva", "Auto Peças Silva", "João Silva",
                "senha123", "joao@email.com", null, new ArrayList<>()
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
        UsuarioDTO.Save dto = new UsuarioDTO.Save(
                "37805121000109", "Mecânica Silva", "Auto Peças Silva", "João Silva",
                "senha123", "joao@email.com", null, new ArrayList<>()
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
        // Arrange: CNPJ com números repetidos (matematicamente inválido)
        UsuarioDTO.Save dto = new UsuarioDTO.Save(
                "11111111111111", "Mecânica Silva", "Auto Peças Silva", "João Silva",
                "senha123", "joao@email.com", null, new ArrayList<>()
        );

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.save(dto);
        });

        assertEquals("Formato de CNPJ invalido.", exception.getMessage()); // Mensagem que você definiu no Validacoes
        verify(usuarioRepository, never()).save(any());
    }
}