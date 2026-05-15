package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.PecaDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PecaService {

    @Autowired private PecaRepository pecaRepository;
    @Autowired private PecaVeiculoRepository pecaVeiculoRepository;
    @Autowired private VeiculoRepository veiculoRepository;

    public void save(PecaDTO.Save dados) {

        if (pecaRepository.existsByCodigo(dados.codigo())) {
            throw new RuntimeException("Código da peça já cadastrado");
        }

        Peca peca = new Peca();
        peca.setCategoria(dados.categoria());
        peca.setCodigo(dados.codigo());
        peca.setDescricao(dados.descricao());
        peca.setEstoque(dados.estoque());
        peca.setMarca(dados.marca());
        peca.setNome(dados.nome());
        peca.setPrecoBase(dados.precoBase());

        peca = pecaRepository.save(peca);

        if (dados.veiculosIds() == null || dados.veiculosIds().isEmpty()) {
            throw new IllegalArgumentException("Selecione ao menos um veículo compatível");
        }

        for (Long idVeiculo : dados.veiculosIds()) {
            Veiculo veiculo = veiculoRepository.findById(idVeiculo)
                    .orElseThrow(() -> new RuntimeException("Veículo com ID " + idVeiculo + " não encontrado"));
            PecaVeiculo pv = new PecaVeiculo();
            pv.setPeca(peca);
            pv.setVeiculo(veiculo);
            pecaVeiculoRepository.save(pv);
        }
    }
}
