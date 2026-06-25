package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.FabricanteDTO;
import br.com.app.quero_pecas.entity.Fabricante;
import br.com.app.quero_pecas.repository.FabricanteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FabricanteServiceTest {

    @Mock
    private FabricanteRepository fabricanteRepository;

    @InjectMocks
    private FabricanteService fabricanteService;

    @Test
    @DisplayName("Deve salvar um fabricante com sucesso")
    void deveSalvarFabricanteComSucesso() {
        FabricanteDTO.Save dados = new FabricanteDTO.Save("12345678000199", "Fabricante Teste");
        Fabricante fabricanteSalvo = new Fabricante(1L, "12345678000199", "Fabricante Teste");

        when(fabricanteRepository.save(any(Fabricante.class))).thenReturn(fabricanteSalvo);

        fabricanteService.save(dados);

        verify(fabricanteRepository, times(1)).save(any(Fabricante.class));
    }

    @Test
    @DisplayName("Deve listar todos os fabricantes cadastrados")
    void deveListarTodosOsFabricantes() {
        Fabricante f1 = new Fabricante(1L, "12345678000199", "Fabricante 1");
        Fabricante f2 = new Fabricante(2L, "98765432000188", "Fabricante 2");

        when(fabricanteRepository.findAll()).thenReturn(List.of(f1, f2));

        List<Fabricante> fabricantes = fabricanteService.listAll();

        assertNotNull(fabricantes);
        assertEquals(2, fabricantes.size());
        assertEquals("Fabricante 1", fabricantes.get(0).getNome());
        assertEquals("Fabricante 2", fabricantes.get(1).getNome());
        verify(fabricanteRepository, times(1)).findAll();
    }
}
