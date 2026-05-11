package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.BuscarPorPlacaDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class VeiculosServiceTest {

    @Mock private VeiculoRepository veiculoRepository;
    @Mock private PecaVeiculoRepository pecaVeiculoRepository;
    @InjectMocks private VeiculoService veiculoService;

    @Test
    void deveRotornarPecas_QuandoPlacaExiste() {
        Veiculo veiculo = new Veiculo();
        veiculo.setIdVeiculo(1L);
        when(veiculoRepository.findByPlaca("ABC1234")).thenReturn(Optional.of(veiculo));

        Peca peca = new Peca();
        peca.setNome("Filtro");
        when(pecaVeiculoRepository.findPecasByVeiculoId(1L)).thenReturn(List.of(peca));

        List<BuscarPorPlacaDTO.PecaResponse> result = veiculoService.buscarPecasPorPlaca("ABC-1234");
        assertFalse(result.isEmpty());
    }
}
