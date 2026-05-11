package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.BuscarPorPlacaDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import br.com.app.quero_pecas.utils.PlacaNaoEncontradaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class VeiculoService {
    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private PecaVeiculoRepository pecaVeiculoRepository;

    private static final String MSG_PLACA_NAO_ENCONTRADA = "Placa não encontrada. Tente buscar por modelo";

    public BuscarPorPlacaDTO.BuscarPlacaResponseDTO buscarPecasPorPlaca(String placa) {
        String placaLimpa = placa.replaceAll("\\s|-", "").toUpperCase();

        Veiculo veiculo = veiculoRepository.findByPlaca(placaLimpa).orElseThrow(() -> new PlacaNaoEncontradaException(MSG_PLACA_NAO_ENCONTRADA));

        List<Peca> pecas = pecaVeiculoRepository.findPecasByVeiculoId(veiculo.getIdVeiculo());

        List<BuscarPorPlacaDTO.PecaResponse> pecasResponses = pecas.stream().map(
                peca -> new BuscarPorPlacaDTO.PecaResponse(
                        peca.getIdPeca(), peca.getNome(), peca.getDescricao(), (double) peca.getPrecoBase(), peca.getEstoque(), peca.getMarca()))
                .toList();

        BuscarPorPlacaDTO.VeiculoDTO veiculoDTO = new BuscarPorPlacaDTO.VeiculoDTO(
                veiculo.getIdVeiculo(), veiculo.getPlaca(), veiculo.getMarca(), veiculo.getModelo(), veiculo.getAnoFabricacao().toString());

        return new BuscarPorPlacaDTO.BuscarPlacaResponseDTO(veiculoDTO, pecasResponses);
    }

}
