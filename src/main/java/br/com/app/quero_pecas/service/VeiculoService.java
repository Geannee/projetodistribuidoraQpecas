package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.VeiculoDTO;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;

@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Transactional
    public Veiculo save(VeiculoDTO.Save dados) {

        if (veiculoRepository.existsByPlacaAndAtivoTrue(dados.placa())) {
            throw new IllegalArgumentException("Placa já cadastrado no sistema.");
        }
        if (veiculoRepository.existsByChassiAndAtivoTrue(dados.chassi())) {
            throw new IllegalArgumentException("Chassi já cadastrado no sistema.");
        }

        Veiculo veiculo = new Veiculo();
        veiculo.setAnoFabricacao(dados.anoFabricacao());
        veiculo.setMarca(dados.marca());
        veiculo.setModelo(dados.modelo());
        veiculo.setChassi(dados.chassi() != null ? dados.chassi().toUpperCase() : null);
        veiculo.setPlaca(dados.placa() != null ? dados.placa().toUpperCase() : null);
        veiculo.setObservacoes(dados.observacoes());
        veiculo.setTipoDeCombustivel(dados.tipoDeCombustivel());
        veiculo.setAtivo(true);

        return veiculoRepository.save(veiculo);
    }

    public List<Veiculo> listActiveHistory(){
        return veiculoRepository.findAllByAtivoTrue();
    }

    public Veiculo delete(Long id) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        veiculo.setAtivo(false);
        return veiculoRepository.save(veiculo);
    }

    public List<String> findModelosByMarca(String marca) {
        if (marca == null || marca.trim().isEmpty()) {
            return List.of(); // Retorna lista vazia de forma segura se a marca for inválida
        }
        return veiculoRepository.findDistinctModelosByMarca(marca.trim());
    }
    public List<Year> findDistinctAnoFabricacaoByModelo(String modelo) {
        if (modelo == null || modelo.trim().isEmpty()) {
            return List.of();
        }
        return veiculoRepository.findDistinctAnoFabricacaoByModelo(modelo.trim());
    }
}
