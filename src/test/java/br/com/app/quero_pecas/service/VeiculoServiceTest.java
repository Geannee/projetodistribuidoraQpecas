package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.BuscarPorPlacaDTO;
import br.com.app.quero_pecas.dto.VeiculoDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.TipoDeCombustivel;
import br.com.app.quero_pecas.entity.TipoDeCompustivel;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Year;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VeiculoServiceTest {

    @Mock private VeiculoRepository veiculoRepository;
    @Mock private PecaVeiculoRepository pecaVeiculoRepository;
    @InjectMocks private VeiculoService veiculoService;

    private VeiculoDTO.Save dadosDTO;
    private Veiculo veiculoExemplo;

    @BeforeEach
    void setUp() {
        dadosDTO = new VeiculoDTO.Save(
                Year.of(2023), "Toyota", "Corolla",
                "CHASSI123", "ABC1D23", "Nota fiscal ok", TipoDeCombustivel.FLEX
        );

        veiculoExemplo = new Veiculo();
        veiculoExemplo.setIdVeiculo(1L);
        veiculoExemplo.setPlaca("ABC1D23");
        veiculoExemplo.setAtivo(true);
    }

    @Test
    @DisplayName("Deve salvar um veículo com sucesso quando dados forem válidos")
    void save_Sucesso() {
        // Arrange
        when(veiculoRepository.existsByPlacaAndAtivoTrue(anyString())).thenReturn(false);
        when(veiculoRepository.existsByChassiAndAtivoTrue(anyString())).thenReturn(false);
        when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculoExemplo);

        // Act
        Veiculo salvo = veiculoService.save(dadosDTO);

        // Assert
        assertNotNull(salvo);
        verify(veiculoRepository, times(1)).save(any(Veiculo.class));
        // Verifica se a placa foi salva em caixa alta
        assertEquals("ABC1D23", salvo.getPlaca());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar salvar placa já existente")
    void save_ErroPlacaExistente() {
        // Arrange
        when(veiculoRepository.existsByPlacaAndAtivoTrue(dadosDTO.placa())).thenReturn(true);

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            veiculoService.save(dadosDTO);
        });

        assertEquals("Placa já cadastrado no sistema.", exception.getMessage());
        verify(veiculoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve listar apenas veículos ativos")
    void listActiveHistory_Sucesso() {
        // Arrange
        when(veiculoRepository.findAllByAtivoTrue()).thenReturn(List.of(veiculoExemplo));

        // Act
        List<Veiculo> resultado = veiculoService.listActiveHistory();

        // Assert
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertTrue(resultado.get(0).isAtivo());
    }

    @Test
    @DisplayName("Deve desativar o veículo (Soft Delete) com sucesso")
    void delete_Sucesso() {
        // Arrange
        Long idTeste = 1L;
        when(veiculoRepository.findById(idTeste)).thenReturn(Optional.of(veiculoExemplo));
        when(veiculoRepository.save(any(Veiculo.class))).thenReturn(veiculoExemplo);

        // Act
        Veiculo deletado = veiculoService.delete(idTeste);

        // Assert
        assertFalse(deletado.isAtivo());
        verify(veiculoRepository).save(veiculoExemplo);
    }

    @Test
    @DisplayName("Deve lançar erro ao tentar deletar veículo inexistente")
    void delete_ErroNaoEncontrado() {
        // Arrange
        when(veiculoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            veiculoService.delete(99L);
        });
    }

    @Test
    void deveRetornarPecas_QuandoPlacaExiste() {
        Veiculo veiculo = new Veiculo();
        veiculo.setIdVeiculo(1L);
        veiculo.setPlaca("ABC1234");
        veiculo.setMarca("Honda");
        veiculo.setModelo("Civic");
        veiculo.setAnoFabricacao(java.time.Year.of(2020));

        when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.of(veiculo));

        Peca peca = new Peca();
        peca.setIdPeca(10L);
        peca.setNome("Filtro");
        peca.setPrecoBase(50.0F);

        when(pecaVeiculoRepository.findPecasByVeiculoId(1L)).thenReturn(List.of(peca));

        BuscarPorPlacaDTO.BuscarPlacaResponseDTO result = veiculoService.buscarPecasPorPlaca("ABC-1234");

        assertNotNull(result);
        assertEquals("2020", result.veiculo().ano());
        assertFalse(result.pecas().isEmpty());
    }
}