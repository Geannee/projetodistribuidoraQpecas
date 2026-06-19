package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.PecaDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import br.com.app.quero_pecas.entity.TipoPeca;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PecaServiceTest {

    @Mock
    private PecaRepository pecaRepository;

    @Mock
    private PecaVeiculoRepository pecaVeiculoRepository;

    @Mock
    private VeiculoRepository veiculoRepository;

    @InjectMocks
    private PecaService pecaService;

    @Test
    @DisplayName("Deve salvar a peça e criar os vínculos com sucesso")
    void deveSalvarPecaComSucesso() {
        // Arrange
        PecaDTO.Save dto = new PecaDTO.Save(
                "Motor", "COD-123", "Motor V8", 5, "Ford", "Motorzão", 5000.0, TipoPeca.ECONOMICO, List.of(1L, 2L)
        );

        Peca pecaSalva = new Peca();
        pecaSalva.setIdPeca(100L);

        when(pecaRepository.existsByCodigo("COD-123")).thenReturn(false);
        when(pecaRepository.save(any(Peca.class))).thenReturn(pecaSalva); // Simula o retorno do ID
        when(veiculoRepository.findById(anyLong())).thenReturn(Optional.of(new Veiculo()));

        // Act
        pecaService.save(dto);

        // Assert
        verify(pecaRepository, times(1)).save(any(Peca.class));
        verify(veiculoRepository, times(2)).findById(anyLong());
        verify(pecaVeiculoRepository, times(2)).save(any(PecaVeiculo.class));
    }

    @Test
    @DisplayName("Deve barrar o cadastro se o código já existir")
    void deveFalharPorCodigoDuplicado() {
        // Arrange
        PecaDTO.Save dto = new PecaDTO.Save(
                "Motor", "COD-123", "Desc", 5, "Marca", "Nome", 10.0, TipoPeca.ORIGINAL, List.of(1L)
        );

        when(pecaRepository.existsByCodigo("COD-123")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> pecaService.save(dto));
        assertEquals("Código da peça já cadastrado", exception.getMessage());
        verify(pecaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve falhar e fazer rollback se o veículo não for encontrado")
    void deveFalharPorVeiculoNaoEncontrado() {
        // Arrange
        PecaDTO.Save dto = new PecaDTO.Save(
                "Freio", "COD-999", "Desc", 5, "Marca", "Nome", 10.0, TipoPeca.PREMIUM, List.of(99L)
        );

        when(pecaRepository.existsByCodigo("COD-999")).thenReturn(false);
        when(pecaRepository.save(any(Peca.class))).thenReturn(new Peca());
        when(veiculoRepository.findById(99L)).thenReturn(Optional.empty()); // Simula veículo inexistente

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> pecaService.save(dto));
        assertTrue(exception.getMessage().contains("não encontrado"));
        verify(pecaVeiculoRepository, never()).save(any());
    }
}